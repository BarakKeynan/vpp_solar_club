import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function PageNotFound() {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    const { data: authData, isFetched } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            try {
                const user = await base44.auth.me();
                return { user, isAuthenticated: true };
            } catch (error) {
                return { user: null, isAuthenticated: false };
            }
        }
    });

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background" dir="rtl">
            <div className="max-w-md w-full text-center space-y-6">
                <h1 className="text-7xl font-light text-muted-foreground/30">404</h1>
                <div className="h-0.5 w-16 bg-border mx-auto" />
                <h2 className="text-2xl font-bold text-foreground">הדף לא נמצא</h2>
                <p className="text-muted-foreground">
                    הדף <span className="font-medium text-foreground">"{pageName}"</span> לא קיים.
                </p>

                {isFetched && authData?.isAuthenticated && authData?.user?.role === 'admin' && (
                    <div className="p-4 bg-muted rounded-xl border border-border text-right">
                        <p className="text-sm text-muted-foreground">
                            הערת מנהל: ייתכן שהדף עדיין לא נוצר.
                        </p>
                    </div>
                )}

                <button
                    onClick={() => window.location.href = '/'}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
                >
                    חזרה לדף הבית
                </button>
            </div>
        </div>
    );
}