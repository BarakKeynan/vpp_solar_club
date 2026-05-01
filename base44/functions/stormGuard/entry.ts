import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const WEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
const DEFAULT_LAT = 31.7683; // Jerusalem default
const DEFAULT_LON = 35.2137;

async function fetchWeatherAlert(lat, lon) {
  if (!WEATHER_API_KEY) {
    // Simulate a storm occasionally for demo
    const hour = new Date().getHours();
    const simulateStorm = hour >= 18 && hour <= 22;
    return {
      storm_active: simulateStorm,
      type: simulateStorm ? 'thunderstorm' : 'clear',
      wind_kmh: simulateStorm ? 75 + Math.random() * 30 : 12,
      lightning_risk: simulateStorm,
      is_mock: true,
    };
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
  );
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const data = await res.json();

  const weatherId = data.weather?.[0]?.id || 800;
  const windKmh = Math.round((data.wind?.speed || 0) * 3.6);
  const isThunderstorm = weatherId >= 200 && weatherId < 300;
  const isStrongWind = windKmh > 60;
  const stormActive = isThunderstorm || isStrongWind;

  return {
    storm_active: stormActive,
    type: isThunderstorm ? 'thunderstorm' : isStrongWind ? 'strong_wind' : 'clear',
    wind_kmh: windKmh,
    lightning_risk: isThunderstorm,
    temp_c: data.main?.temp,
    description: data.weather?.[0]?.description,
    is_mock: false,
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get user location from profile if available
    const users = await base44.asServiceRole.entities.User.list();
    
    const weather = await fetchWeatherAlert(DEFAULT_LAT, DEFAULT_LON);

    // If storm active — update all users' storm status and set battery target to 100%
    if (weather.storm_active) {
      for (const user of users) {
        if (user.system_connected) {
          await base44.asServiceRole.entities.User.update(user.id, {
            storm_guard_active: true,
            storm_guard_soc_target: 100,
            storm_guard_updated_at: new Date().toISOString(),
          }).catch(() => {}); // non-blocking
        }
      }

      // Send alert emails to connected users
      const connectedUsers = users.filter(u => u.system_connected && u.email);
      for (const user of connectedUsers.slice(0, 50)) { // cap at 50
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: user.email,
          subject: '⛈️ מגן סופה הופעל — VPP Solar Club',
          body: `שלום ${user.full_name || user.email},\n\nזוהתה סופה באזורך (${weather.type}, רוחות ${weather.wind_kmh} קמ"ש).\nמגן הסופה הופעל אוטומטית — הסוללה שלך נטענת ל-100% לגיבוי מלא.\n\nבברכה,\nצוות VPP Solar Club`,
          from_name: 'VPP Solar Club',
        }).catch(() => {});
      }
    } else {
      // Clear storm guard when weather is clear
      for (const user of users) {
        if (user.storm_guard_active) {
          await base44.asServiceRole.entities.User.update(user.id, {
            storm_guard_active: false,
            storm_guard_updated_at: new Date().toISOString(),
          }).catch(() => {});
        }
      }
    }

    return Response.json({ success: true, weather, users_affected: weather.storm_active ? users.filter(u => u.system_connected).length : 0 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});