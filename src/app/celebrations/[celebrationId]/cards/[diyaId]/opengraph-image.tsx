import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export const alt = 'Diya Light Celebration';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({
    params
}: {
    params: Promise<{ celebrationId: string; diyaId: string }>
}) {
    const { celebrationId, diyaId } = await params;
    const position = parseInt(diyaId);

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch celebration details
    const { data: celebration } = await supabase
        .from('celebrations')
        .select('name')
        .eq('id', celebrationId)
        .single();

    // Fetch diya details
    const { data: diya } = await supabase
        .from('diya_lights')
        .select('user_name, message, lit_at')
        .eq('celebration_id', celebrationId)
        .eq('position', position)
        .single();

    const celebrationName = celebration?.name || 'Light a Diya';
    const userName = diya?.user_name || 'A Devotee';
    const message = diya?.message;

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #1e3a8a, #4f46e5)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                }}
            >
                {/* Background Decorative Elements */}
                <div style={{ position: 'absolute', top: 20, left: 20, opacity: 0.2, fontSize: 80 }}>✨</div>
                <div style={{ position: 'absolute', bottom: 40, right: 40, opacity: 0.2, fontSize: 100 }}>🪔</div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        padding: '40px 60px',
                        width: '900px',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                        textAlign: 'center',
                    }}
                >
                    {/* Diya Icon */}
                    <div style={{ display: 'flex', marginBottom: '24px' }}>
                        <svg
                            width="100"
                            height="100"
                            viewBox="0 0 24 24"
                            fill="#fbbf24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 2C12 2 16 8 16 11C16 13.2091 14.2091 15 12 15C9.79086 15 8 13.2091 8 11C8 8 12 2 12 2ZM6 16C6 16.5 6.5 19 12 19C17.5 19 18 16.5 18 16L22 14L21 21H3L2 14L6 16Z" stroke="white" strokeWidth="1" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <div
                        style={{
                            fontSize: '32px',
                            color: '#fbbf24',
                            marginBottom: '10px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                        }}
                    >
                        {celebrationName}
                    </div>

                    <h1
                        style={{
                            fontSize: '56px',
                            fontWeight: 800,
                            margin: '0 0 20px 0',
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            lineHeight: 1.1,
                        }}
                    >
                        {userName}&apos;s Light
                    </h1>

                    {message ? (
                        <div
                            style={{
                                fontSize: '36px',
                                opacity: 0.9,
                                fontStyle: 'italic',
                                marginTop: '20px',
                                padding: '20px',
                                borderTop: '1px solid rgba(255,255,255,0.3)',
                                maxWidth: '80%',
                                lineHeight: 1.4,
                            }}
                        >
                            &ldquo;{message}&rdquo;
                        </div>
                    ) : (
                        <div
                            style={{
                                fontSize: '28px',
                                opacity: 0.8,
                                marginTop: '10px',
                            }}
                        >
                            Has lit a diya for prosperity and peace.
                        </div>
                    )}

                </div>

                <div
                    style={{
                        position: 'absolute',
                        bottom: '30px',
                        fontSize: '20px',
                        opacity: 0.6,
                        letterSpacing: '1px',
                    }}
                >
                    parambhakti.com
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
