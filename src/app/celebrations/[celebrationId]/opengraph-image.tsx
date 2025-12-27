import { ImageResponse } from 'next/og';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export const alt = 'Light a Diya Celebration';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ celebrationId: string }> }) {
    const { celebrationId } = await params;

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: celebration } = await supabase
        .from('celebrations')
        .select('name, diya_count')
        .eq('id', celebrationId)
        .single();

    const celebrationName = celebration?.name || 'Light a Diya';

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
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        padding: '40px 60px',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                    }}
                >
                    {/* Diya Icon */}
                    <div style={{ display: 'flex', marginBottom: '20px' }}>
                        <svg
                            width="120"
                            height="120"
                            viewBox="0 0 24 24"
                            fill="#fbbf24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 2C12 2 16 8 16 11C16 13.2091 14.2091 15 12 15C9.79086 15 8 13.2091 8 11C8 8 12 2 12 2ZM6 16C6 16.5 6.5 19 12 19C17.5 19 18 16.5 18 16L22 14L21 21H3L2 14L6 16Z" stroke="white" strokeWidth="1" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <h1
                        style={{
                            fontSize: '60px',
                            fontWeight: 800,
                            margin: '0 0 20px 0',
                            textAlign: 'center',
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                    >
                        {celebrationName}
                    </h1>

                    <div
                        style={{
                            fontSize: '30px',
                            opacity: 0.9,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <span>✨</span>
                        <span>Join us to light a diya</span>
                        <span>✨</span>
                    </div>
                </div>

                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        fontSize: '24px',
                        opacity: 0.6,
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
