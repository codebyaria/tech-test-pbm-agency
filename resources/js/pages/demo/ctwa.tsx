import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { TrackedCTA } from '@/components/tracking/TrackedCTA';

/* ============================================================
   Full Bright Indonesia — TOEFL ITP landing page
   Converted from the design source. Styling: Tailwind CSS v4
   utility classes (arbitrary properties keep the design 1:1).
   Assets live in public/assets/ and are referenced as /assets/*
   ============================================================ */

const WA_NUMBER = '6285255499299';
const waUrl = (text: string): string =>
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
const IPB_LOGO_URL =
    'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEixYKuV2c5YoKDj9dHdJt5S1Lt-RSNZ0_3GgZbEbylP9emf5D9KGekhNq9RImhInYYgfcyOsyFFbDOdugmWwN2nWqxA2tDtJux26STvOi6BVFBM43oClQX5rK3aeIzbhUm_thZRVsKYxFgFJXa4AoumNIp5eBy3nYfzqgBpHIX_afCiFGRzAz-E_g/w320-h223/IPB%20University%20(Institut%20Pertanian%20Bogor)%20Logo.png';

const FLASH_WINDOW_MS = 12 * 60 * 60 * 1000;
function flashDeadline(): number {
    let start = Number(localStorage.getItem('fb_flash_start') || 0);

    if (!start || start + FLASH_WINDOW_MS <= Date.now()) {
        start = Date.now();

        try {
            localStorage.setItem('fb_flash_start', String(start));
        } catch {
            /* storage disabled */
        }
    }

    return start + FLASH_WINDOW_MS;
}
function flashRemainingMs(): number {
    if (typeof window === 'undefined') {
        return FLASH_WINDOW_MS;
    }

    return Math.max(0, flashDeadline() - Date.now());
}
function formatCountdown(ms: number): string {
    const t = Math.floor(ms / 1000);
    const h = String(Math.floor(t / 3600)).padStart(2, '0');
    const m = String(Math.floor((t % 3600) / 60)).padStart(2, '0');
    const s = String(t % 60).padStart(2, '0');

    return `${h}:${m}:${s}`;
}
function initialMode(): PricingMode {
    try {
        return new URLSearchParams(window.location.search).get('mode') ===
            'tutor'
            ? 'tutor'
            : 'self';
    } catch {
        return 'self';
    }
}

type PricingMode = 'self' | 'tutor';

const WA_SCREENSHOTS: { src: string; score: string }[] = [
    { src: '/assets/toefl1.webp', score: '547' },
    { src: '/assets/toefl2.webp', score: '543' },
    { src: '/assets/toefl3.webp', score: '563' },
    { src: '/assets/toefl4.webp', score: '560' },
    { src: '/assets/toefl5.webp', score: '507' },
    { src: '/assets/toefl6.webp', score: '513' },
    { src: '/assets/toefl7.webp', score: '537' },
    { src: '/assets/toefl9.webp', score: '560' },
];

const REVIEW_COUNT = 19;
const reviewSrc = (i: number): string => `/assets/Riview (${i + 1}).webp`;

const RETURN_OPTIONS: string[] = [
    'Harganya masih terlalu mahal buatku',
    'Belum yakin bisa mencapai target TOEFL-ku',
    'Belum yakin program ini cocok untuk kebutuhanku',
    'Masih membandingkan dengan program lain',
];

const RETURN_WA_MSGS: string[] = [
    'Halo Admin Full Bright Indonesia. Saya mau konsultasi soal paket dan harga sebelum daftar.',
    'Halo Admin Full Bright Indonesia. Saya mau konsultasi soal metode belajar dan hasil yang bisa dicapai sebelum daftar.',
    'Halo Admin Full Bright Indonesia. Saya mau konsultasi apakah program ini cocok dengan kebutuhan saya sebelum daftar.',
    'Halo Admin Full Bright Indonesia. Saya masih membandingkan dengan program lain, mau tanya-tanya dulu.',
];

const RETURN_SUBTEXTS: string[] = [
    'Ada yang ingin ditanyakan soal harga atau paket?',
    'Mau tahu apakah program ini cocok untuk target skor kamu?',
    'Konsultasikan dulu apakah program ini cocok untukmu.',
    'Masih membandingkan? Tanya tim kami tentang programnya.',
];

const FAQ_CATEGORIES: string[] = [
    'Belajar Mandiri (LMS)',
    'Metode & Efektivitas',
    'Dibimbing Tutor',
    'Sertifikat & Legalitas',
    'Pendaftaran & Pembayaran',
    'Jaminan & Garansi',
];

const FAQ_ITEM_CATEGORIES: string[] = [
    'Belajar Mandiri (LMS)',
    'Belajar Mandiri (LMS)',
    'Belajar Mandiri (LMS)',
    'Belajar Mandiri (LMS)',
    'Belajar Mandiri (LMS)',
    'Metode & Efektivitas',
    'Metode & Efektivitas',
    'Metode & Efektivitas',
    'Metode & Efektivitas',
    'Metode & Efektivitas',
    'Dibimbing Tutor',
    'Dibimbing Tutor',
    'Dibimbing Tutor',
    'Sertifikat & Legalitas',
    'Sertifikat & Legalitas',
    'Pendaftaran & Pembayaran',
    'Jaminan & Garansi',
];

/** Turns a CSS declaration string into a React style object (used for values that change at runtime). */
function css(decl: string): CSSProperties {
    const out: Record<string, string> = {};
    decl.split(';').forEach((part) => {
        const chunk = part.trim();

        if (!chunk) {
            return;
        }

        const at = chunk.indexOf(':');

        if (at < 0) {
            return;
        }

        const prop = chunk.slice(0, at).trim();
        const value = chunk.slice(at + 1).trim();
        const key = prop.startsWith('--')
            ? prop
            : prop.replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase());
        out[key] = value;
    });

    return out as CSSProperties;
}

const navStyle = (scrolled: boolean): string =>
    'transition:all 0.3s;border-bottom:1px solid #f3f4f6;' +
    (scrolled
        ? 'background:rgba(255,255,255,0.95);box-shadow:0 4px 12px rgba(0,0,0,0.08);backdrop-filter:blur(8px);'
        : 'background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.05);');

const cmpHeaderStyle = (bannerH: number): string =>
    `position:sticky;top:${bannerH + 64}px;z-index:20;display:grid;grid-template-columns:1.5fr 0.85fr 0.85fr 0.9fr;background:#F9F9F9;border-bottom:1px solid #ececec;border-radius:20px 20px 0 0;align-items:stretch;overflow:hidden;`;

const toggleBtnStyle = (active: boolean): string =>
    `position:relative;border:none;cursor:pointer;font-family:'Nunito',sans-serif;font-size:15px;font-weight:800;padding:12px 26px;border-radius:9999px;transition:all 0.2s ease;background:${active ? '#D70808' : 'transparent'};color:${active ? '#fff' : '#6b7280'};box-shadow:${active ? '0 4px 14px rgba(215,8,8,0.28)' : 'none'};text-decoration:${active ? 'none' : 'underline dotted'};text-underline-offset:4px;text-decoration-thickness:2px;`;

const catBtnStyle = (active: boolean): string =>
    `cursor:pointer;font-size:12px;font-weight:700;padding:8px 16px;border-radius:9999px;border:1.5px solid #D70808;background:${active ? '#D70808' : '#fff'};color:${active ? '#fff' : '#D70808'};`;

const faqItemStyle = (activeCat: string | null, i: number): string =>
    `border-bottom:1px solid #f3f4f6;display:${activeCat === null || activeCat === FAQ_ITEM_CATEGORIES[i] ? 'block' : 'none'};`;

const faqQStyle = (open: boolean): string =>
    `font-size:14px;font-weight:700;line-height:1.4;font-family:'Nunito',sans-serif;color:${open ? '#D70808' : '#151515'};`;

const faqChevStyle = (open: boolean): string =>
    `flex-shrink:0;margin-top:2px;font-size:14px;color:${open ? '#D70808' : '#151515'};transform:${open ? 'rotate(180deg)' : 'rotate(0deg)'};display:inline-block;`;

const surveyOptStyle = (selected: boolean): string =>
    `display:flex;align-items:center;gap:10px;width:100%;min-height:48px;text-align:left;padding:10px 12px;border-radius:9px;cursor:pointer;background:${selected ? 'rgba(215,8,8,0.05)' : '#fff'};border:1px solid ${selected ? 'rgba(215,8,8,0.3)' : '#e5e5e5'};transition:all 0.15s ease;font-family:inherit;`;

const rpOptStyle = (): string =>
    'display:flex;align-items:center;gap:10px;width:100%;min-height:54px;text-align:left;padding:12px 14px;border-radius:12px;cursor:pointer;background:#fff;border:1px solid #e5e5e5;transition:all 0.15s ease;font-family:inherit;box-sizing:border-box;';

const surveyMsgStyle = (answered: boolean): string =>
    `margin:8px 0 0;min-height:16px;font-size:12px;font-weight:600;color:#6b7280;opacity:${answered ? 1 : 0};transition:opacity 0.25s ease;`;

const lbImgStyle = (i: number | null): string =>
    `height:80vh;width:340px;max-width:80vw;border-radius:16px;background-image:url('${WA_SCREENSHOTS[i ?? 0].src}');background-size:contain;background-repeat:no-repeat;background-position:center;box-shadow:0 24px 80px rgba(0,0,0,0.6);`;

const rvImgStyle = (i: number | null): string =>
    `height:85vh;width:400px;max-width:90vw;border-radius:16px;background-image:url('${reviewSrc(i ?? 0)}');background-size:contain;background-repeat:no-repeat;background-position:center;box-shadow:0 24px 80px rgba(0,0,0,0.6);`;

const gSideStyle = (side: 'prev' | 'next', gIdx: number): string => {
    const idx =
        side === 'prev'
            ? (gIdx - 1 + REVIEW_COUNT) % REVIEW_COUNT
            : (gIdx + 1) % REVIEW_COUNT;
    const left = side === 'prev' ? 'calc(50% - 260px)' : 'calc(50% + 100px)';

    return `position:absolute;transition:all 0.6s ease;cursor:pointer;overflow:hidden;border-radius:16px;background-image:url('${reviewSrc(idx)}');background-size:cover;background-position:center;left:${left};width:160px;height:210px;opacity:0.5;z-index:1;box-shadow:0 8px 28px rgba(0,0,0,0.18);`;
};

const KEYFRAMES = `
  html, body, #app { width: 100%; max-width: 100vw; overflow-x: clip; -webkit-overflow-scrolling: touch; }
  body { margin: 0; font-family: 'Nunito', system-ui, sans-serif; overflow-x: clip; max-width: 100vw; }
  *, *::before, *::after { min-width: 0; box-sizing: border-box; }
  img, video, iframe, svg { max-width: 100%; height: auto; }
  section { max-width: 100vw; min-width: 0; overflow-x: clip; }
  h1, h2, h3, h4, h5, h6, p, span, div, li, a, button, input, select, textarea, ul, ol, strong, b, em, i, label { font-family: 'Nunito', system-ui, sans-serif; }
  h1, h2, h3, h4, h5, h6, p { overflow-wrap: anywhere; word-break: break-word; }
  a { color: #D70808; }
  a:hover { color: #b30606; }
  @keyframes infiniteScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes fbFadeInUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fbSheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes heroBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
`;

function CanonicalUrl(): null {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const url = new URL(window.location.href);
            ['verify', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((k) => {
                url.searchParams.delete(k);
            });
            const clean = url.origin + url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : '') + url.hash;
            let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', 'canonical');
                document.head.appendChild(link);
            }
            link.setAttribute('href', clean);
            if (url.searchParams.toString() !== window.location.search.replace(/^\?/, '')) {
                window.history.replaceState({}, '', clean);
            }
        } catch (_) {
            // ignore
        }
    }, []);
    return null;
}

export default function LandingPage() {
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [bannerH, setBannerH] = useState<number>(38);
    const [mode, setMode] = useState<PricingMode>(initialMode);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [activeCat, setActiveCat] = useState<string | null>(null);
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
    const [reviewIdx, setReviewIdx] = useState<number | null>(null);
    const [gIdx, setGIdx] = useState<number>(0);
    const [surveySelected, setSurveySelected] = useState<number | null>(null);
    const [rpOpen, setRpOpen] = useState<boolean>(false);
    const [rpSelected, setRpSelected] = useState<number | null>(null);
    const [waBubbleOpen, setWaBubbleOpen] = useState<boolean>(false);
    const [showOverlay, setShowOverlay] = useState<boolean>(true);
    const [showLmsOverlay, setShowLmsOverlay] = useState<boolean>(true);
    const [countdown, setCountdown] = useState<string>('12:00:00');
    const [flashVisible, setFlashVisible] = useState<boolean>(true);

    const bannerRef = useRef<HTMLAnchorElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const lmsVideoRef = useRef<HTMLVideoElement | null>(null);

    /* flash-sale countdown, per visitor, persisted in localStorage */
    useEffect(() => {
        const tick = (): void => {
            const left = flashRemainingMs();
            setCountdown(formatCountdown(left));
            setFlashVisible(left > 0);
        };
        tick();
        const id = window.setInterval(tick, 1000);

        return () => window.clearInterval(id);
    }, []);

    /* navbar shadow + sticky offset below the banner */
    useEffect(() => {
        const onScroll = (): void => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const measure = (): void =>
            setBannerH(
                bannerRef.current
                    ? Math.round(
                          bannerRef.current.getBoundingClientRect().height,
                      )
                    : 0,
            );
        measure();
        window.addEventListener('resize', measure);

        return () => window.removeEventListener('resize', measure);
    }, [flashVisible]);

    /* Google review carousel autoplay */
    useEffect(() => {
        const id = window.setInterval(
            () => setGIdx((i) => (i + 1) % REVIEW_COUNT),
            3000,
        );

        return () => window.clearInterval(id);
    }, [gIdx]);

    /* proactive WhatsApp bubble: 7s or 25% scroll, once per session */
    useEffect(() => {
        let dismissed = false;

        try {
            dismissed = sessionStorage.getItem('fb_wa_bubble_v2') === '1';
        } catch {
            /* storage disabled */
        }

        if (dismissed) {
            return;
        }

        const open = (): void => setWaBubbleOpen(true);
        const timer = window.setTimeout(open, 7000);
        const onScroll = (): void => {
            const pct =
                (window.scrollY + window.innerHeight) /
                Math.max(document.documentElement.scrollHeight, 1);

            if (pct > 0.25) {
                open();
                window.removeEventListener('scroll', onScroll);
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    /* exit-checkout survey: shown when the visitor comes back to the tab */
    useEffect(() => {
        const onVisible = (): void => {
            if (document.visibilityState !== 'visible') {
                return;
            }

            try {
                const clickedAt = Number(
                    localStorage.getItem('fb_checkout_clicked_at') || 0,
                );
                const shown = localStorage.getItem('fb_return_popup_shown');

                if (clickedAt && !shown && Date.now() - clickedAt < 86400000) {
                    setRpOpen(true);
                    localStorage.setItem('fb_return_popup_shown', '1');
                }
            } catch {
                /* storage disabled */
            }
        };
        document.addEventListener('visibilitychange', onVisible);

        return () =>
            document.removeEventListener('visibilitychange', onVisible);
    }, []);

    const closeLightbox = useCallback((): void => setLightboxIdx(null), []);
    const prevPhoto = useCallback(
        (): void =>
            setLightboxIdx(
                (i) =>
                    ((i ?? 0) - 1 + WA_SCREENSHOTS.length) %
                    WA_SCREENSHOTS.length,
            ),
        [],
    );
    const nextPhoto = useCallback(
        (): void =>
            setLightboxIdx((i) => ((i ?? 0) + 1) % WA_SCREENSHOTS.length),
        [],
    );
    const closeReview = useCallback((): void => setReviewIdx(null), []);
    const prevReview = useCallback(
        (): void =>
            setReviewIdx((i) => ((i ?? 0) - 1 + REVIEW_COUNT) % REVIEW_COUNT),
        [],
    );
    const nextReview = useCallback(
        (): void => setReviewIdx((i) => ((i ?? 0) + 1) % REVIEW_COUNT),
        [],
    );
    const prevGoogle = useCallback(
        (): void => setGIdx((i) => (i - 1 + REVIEW_COUNT) % REVIEW_COUNT),
        [],
    );
    const nextGoogle = useCallback(
        (): void => setGIdx((i) => (i + 1) % REVIEW_COUNT),
        [],
    );
    const closeReturnPopup = useCallback((): void => setRpOpen(false), []);
    const toggleCat = useCallback(
        (i: number): void =>
            setActiveCat((cur) =>
                cur === FAQ_CATEGORIES[i] ? null : FAQ_CATEGORIES[i],
            ),
        [],
    );
    const playVideo = useCallback((): void => {
        if (videoRef.current?.paused) {
            void videoRef.current.play();
        }
    }, []);
    const playLmsVideo = useCallback((): void => {
        if (lmsVideoRef.current?.paused) {
            void lmsVideoRef.current.play();
        }
    }, []);
    const scrollToPricing = useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>): void => {
            const pricing = document.getElementById('pricing');

            if (!pricing) {
                return;
            }

            event.preventDefault();
            window.history.replaceState(null, '', '#pricing');

            const bannerHeight =
                bannerRef.current?.getBoundingClientRect().height ?? bannerH;
            const targetY =
                pricing.getBoundingClientRect().top +
                window.scrollY -
                bannerHeight;

            window.scrollTo({ top: Math.max(0, targetY), behavior: 'auto' });
        },
        [bannerH],
    );
    const dismissWaBubble = useCallback((): void => {
        setWaBubbleOpen(false);

        try {
            sessionStorage.setItem('fb_wa_bubble_v2', '1');
        } catch {
            /* storage disabled */
        }
    }, []);
    const markCheckoutClicked = useCallback((): void => {
        try {
            localStorage.setItem('fb_checkout_clicked_at', String(Date.now()));
            localStorage.removeItem('fb_return_popup_shown');
        } catch {
            /* storage disabled */
        }
    }, []);

    /* keyboard nav for both lightboxes */
    useEffect(() => {
        const onKey = (e: KeyboardEvent): void => {
            if (lightboxIdx !== null) {
                if (e.key === 'Escape') {
                    closeLightbox();
                } else if (e.key === 'ArrowLeft') {
                    prevPhoto();
                } else if (e.key === 'ArrowRight') {
                    nextPhoto();
                }
            } else if (reviewIdx !== null) {
                if (e.key === 'Escape') {
                    closeReview();
                } else if (e.key === 'ArrowLeft') {
                    prevReview();
                } else if (e.key === 'ArrowRight') {
                    nextReview();
                }
            } else if (rpOpen && e.key === 'Escape') {
                closeReturnPopup();
            }
        };
        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, [
        lightboxIdx,
        reviewIdx,
        rpOpen,
        closeLightbox,
        prevPhoto,
        nextPhoto,
        closeReview,
        prevReview,
        nextReview,
        closeReturnPopup,
    ]);

    return (
        <>
            <Head title="Full Bright Indonesia | Persiapan TOEFL ITP" />
            <CanonicalUrl />
            <style>{KEYFRAMES}</style>

            <div className="[min-height:100vh] [width:100%] [max-width:100%] [min-width:0] [overflow-x:clip] [font-family:Nunito,system-ui,sans-serif] [background:#fff]">
                {/* Fixed sale banner + navigation */}
                <div className="[position:fixed] [top:0] [right:0] [left:0] [z-index:50]">
                    {flashVisible ? (
                        <a
                            ref={bannerRef}
                            id="urgency-banner"
                            href="#pricing"
                            onClick={scrollToPricing}
                            className="[box-sizing:border-box] [display:flex] [width:100%] [max-width:100%] [flex-wrap:nowrap] [align-items:center] [justify-content:center] [gap:8px] [overflow:hidden] [padding:8px_12px] [text-align:center] [white-space:nowrap] [background:#C10707] [text-decoration:none] max-[500px]:[padding:10px_12px]"
                        >
                            <span
                                id="banner-full"
                                className="[font-size:13px] [line-height:1.4] [font-weight:800] [letter-spacing:0.02em] [color:#fff] [text-transform:uppercase] max-[500px]:[display:none]"
                            >
                                🔥 FLASH SALE SEPTEMBER · DISKON 60%
                            </span>
                            <span
                                id="banner-short"
                                className="[display:none] [font-size:11px] [line-height:1.4] [font-weight:800] [letter-spacing:0.01em] [color:#fff] [text-transform:uppercase] max-[500px]:[display:inline] max-[500px]:[font-size:12.5px]"
                            >
                                🔥 FLASH SALE SEPTEMBER · 60%
                            </span>
                            <span className="[display:inline-flex] [flex-shrink:0] [align-items:center] [gap:5px] [border-radius:9999px] [padding:3px_10px] [line-height:1.2] [color:#C10707] [background:#fff]">
                                <span
                                    id="banner-timer-label"
                                    className="[font-size:11px] [font-weight:800] [letter-spacing:0.04em] [text-transform:uppercase] max-[500px]:[display:none]"
                                >
                                    ⏱ Berakhir
                                </span>
                                <span className="[font-size:13px] [font-weight:900] [letter-spacing:0.04em] [font-variant-numeric:tabular-nums] max-[500px]:[font-size:14px]">
                                    {countdown}
                                </span>
                            </span>
                        </a>
                    ) : null}

                    <header style={css(navStyle(scrolled))}>
                    <div className="[margin:0_auto] [box-sizing:border-box] [display:flex] [height:64px] [width:100%] [max-width:1152px] [min-width:0] [align-items:center] [justify-content:space-between] [padding:0_24px]">
                        <a
                            href="#"
                            className="[display:flex] [align-items:center] [text-decoration:none]"
                        >
                            <img
                                src="https://toefl.fullbrightindonesia.org/logo/Logo-Fullbright.webp"
                                alt="Full Bright Indonesia"
                                className="[height:auto] [width:160px] [max-width:40vw] [object-fit:contain]"
                            />
                        </a>
                        <TrackedCTA
                            zone="nav"
                            action="scroll"
                            label="Amankan Seat"
                            href="#pricing"
                            onClick={scrollToPricing}
                            className="[display:flex] [flex-direction:column] [justify-content:center] [gap:1px] [border-radius:9999px] [padding:7px_16px] [max-width:48vw] [box-shadow:0_6px_16px_rgba(215,8,8,0.35)] [background:#D70808] [text-decoration:none] max-[639px]:[padding:5px_10px] max-[639px]:[max-width:54vw]"
                        >
                            <span className="[font-size:13px] [line-height:1.2] [font-weight:800] [white-space:nowrap] [color:#fff]">
                                🎓 Amankan Seat
                            </span>
                            <span className="[display:flex] [align-items:center] [gap:5px]">
                                <span className="[font-size:11px] [white-space:nowrap] [color:rgba(255,255,255,0.55)] [text-decoration:line-through]">
                                    Rp250rb
                                </span>
                                <span className="[font-size:14px] [font-weight:900] [white-space:nowrap] [color:#fff]">
                                    Rp99rb
                                </span>
                                <span className="[border-radius:9999px] [padding:2px_7px] [font-size:10px] [font-weight:900] [white-space:nowrap] [color:#151515] [background:#F59E0B]">
                                    -60%
                                </span>
                            </span>
                        </TrackedCTA>
                    </div>
                    </header>
                </div>
                <div style={{ height: bannerH + 64 }} aria-hidden="true"></div>

                {/* Hero */}
                <section
                    id="hero"
                    className="[position:relative] [overflow:hidden] [background:linear-gradient(160deg,#fff_55%,#FFF5F5_100%)]"
                >
                    <div className="[pointer-events:none] [position:absolute] [top:-96px] [right:-96px] [height:384px] [width:384px] [border-radius:9999px] [opacity:0.07] [filter:blur(120px)] [background:#D70808]"></div>
                    <div className="[pointer-events:none] [position:absolute] [bottom:-96px] [left:-96px] [height:288px] [width:288px] [border-radius:9999px] [opacity:0.05] [filter:blur(100px)] [background:#151515]"></div>

                    <div
                        id="hero-section-inner"
                        className="[position:relative] [margin:0_auto] [box-sizing:border-box] [display:grid] [width:100%] [max-width:1152px] [min-width:0] [grid-template-columns:1fr] [gap:40px] [padding:40px_24px_16px] max-[639px]:[gap:24px] max-[639px]:[padding-top:24px] max-[639px]:[padding-bottom:8px]"
                    >
                        <div className="[display:grid] [min-width:0] [grid-template-columns:1.05fr_0.95fr] [align-items:center] [gap:40px] max-[899px]:[position:relative] max-[899px]:[grid-template-columns:1fr] max-[899px]:[gap:12px]">
                            <div className="[position:relative] [z-index:1] [grid-column:1] [display:flex] [min-width:0] [flex-direction:column] [gap:16px]">
                                <div
                                    id="hero-rating-badge"
                                    className="[box-sizing:border-box] [display:inline-flex] [width:fit-content] [max-width:100%] [align-items:center] [gap:8px] [border-radius:9999px] [padding:6px_16px] [font-size:12px] [font-weight:700] [letter-spacing:0.05em] [color:#374151] [border:1.5px_solid_#151515] max-[639px]:[padding:clamp(4px,1.2vw,6px)_clamp(10px,3vw,16px)] max-[639px]:[font-size:clamp(9px,2.6vw,12px)]"
                                >
                                    <span className="[display:flex] [gap:2px] [color:#F59E0B]">
                                        ★★★★★
                                    </span>
                                    <span className="[letter-spacing:0.08em] [text-transform:uppercase]">
                                        45.000+ ALUMNI
                                    </span>
                                    <div className="[margin-left:8px] [display:flex]">
                                        <img
                                            src="/assets/People%201.webp"
                                            alt="alumni"
                                            className="[margin-left:-8px] [height:20px] [width:20px] [border-radius:9999px] [object-fit:cover] [border:2px_solid_#fff] max-[639px]:[height:clamp(14px,4vw,20px)] max-[639px]:[width:clamp(14px,4vw,20px)]"
                                        />
                                        <img
                                            src="/assets/People%202.webp"
                                            alt="alumni"
                                            className="[margin-left:-8px] [height:20px] [width:20px] [border-radius:9999px] [object-fit:cover] [border:2px_solid_#fff] max-[639px]:[height:clamp(14px,4vw,20px)] max-[639px]:[width:clamp(14px,4vw,20px)]"
                                        />
                                        <img
                                            src="/assets/People%203.webp"
                                            alt="alumni"
                                            className="[margin-left:-8px] [height:20px] [width:20px] [border-radius:9999px] [object-fit:cover] [border:2px_solid_#fff] max-[639px]:[height:clamp(14px,4vw,20px)] max-[639px]:[width:clamp(14px,4vw,20px)]"
                                        />
                                    </div>
                                </div>

                                <h1
                                    id="hero-headline"
                                    className="[margin:0] [max-width:100%] [min-width:0] [font-family:Nunito,sans-serif] [font-size:clamp(30px,4vw,44px)] [line-height:1.15] [font-weight:900] [overflow-wrap:anywhere] [color:#151515] max-[639px]:[font-size:clamp(24px,7vw,30px)]"
                                >
                                    Serius Soal Beasiswa &amp; CPNS?
                                    <br />
                                    Capai{' '}
                                    <span className="[background-image:linear-gradient(rgb(245,_183,_0),_rgb(245,_183,_0))] [box-decoration-break:clone] [background-size:100%_12px] [background-position:0px_100%] [background-repeat:no-repeat] [padding:0px_2px] [-webkit-box-decoration-break:clone]">
                                        TOEFL 500+ dalam 15 Hari Saja
                                    </span>
                                </h1>

                                <p
                                    id="hero-subheadline"
                                    className="[margin:0] [max-width:100%] [min-width:0] [text-align:center] [font-size:16px] [line-height:1.6] [overflow-wrap:anywhere] [color:#3d3d3d] max-[639px]:[font-size:clamp(12px,3.4vw,14px)]"
                                >
                                    <b>Persiapkan dari</b>
                                    <strong className="[color:rgb(21,_21,_21)]">
                                        &nbsp;sekarang
                                    </strong>
                                    &nbsp;dengan strategi{' '}
                                    <strong className="[color:rgb(21,_21,_21)]">
                                        belajar 1 jam sehari
                                    </strong>{' '}
                                    yang telah membantu{' '}
                                    <strong className="[color:rgb(21,_21,_21)]">
                                        45.000+ alumni
                                    </strong>{' '}
                                    meraih <b>beasiswa impian</b> mereka.
                                </p>

                                <div
                                    id="hero-trust-badges"
                                    className="[display:flex] [flex-wrap:wrap] [gap:8px] max-[639px]:[display:none]"
                                >
                                    <span className="[display:inline-flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:6px_12px] [font-size:12px] [font-weight:600] [color:#374151] [background:#F3F4F6] [border:1px_solid_#e5e7eb]">
                                        ✓ Lembaga Resmi ITP &amp; IIEF
                                    </span>

                                    <span className="[display:inline-flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:6px_12px] [font-size:12px] [font-weight:600] [color:#374151] [background:#F3F4F6] [border:1px_solid_#e5e7eb]">
                                        ✓ 13+ Tahun Pengalaman
                                    </span>
                                </div>

                                <div
                                    id="hero-cta-row"
                                    className="[display:flex] [flex-direction:column] [gap:12px]"
                                >
                                    <div
                                        id="hero-cta-buttons"
                                        className="[display:flex] [width:100%] [max-width:100%] [min-width:0] [flex-wrap:wrap] [gap:12px] max-[639px]:[flex-direction:column]"
                                    >
                                        <TrackedCTA
                                            zone="hero"
                                            action="scroll"
                                            label="Mulai Persiapan TOEFL"
                                            href="#pricing"
                                            onClick={scrollToPricing}
                                            className="[display:inline-flex] [max-width:100%] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:14px_28px] [font-size:16px] [font-weight:700] [color:#fff] [box-shadow:0_4px_20px_rgba(215,8,8,0.35)] [background:#D70808] [text-decoration:none] hover:[color:#fff] focus:[color:#fff] active:[color:#fff] max-[500px]:[box-sizing:border-box] max-[500px]:[width:100%] max-[500px]:[padding:clamp(10px,3vw,14px)_clamp(16px,5vw,28px)] max-[500px]:[font-size:clamp(12px,3.6vw,16px)]"
                                            style={{ color: '#fff' }}
                                        >
                                            Mulai Persiapan TOEFL →
                                        </TrackedCTA>
                                        <a
                                            href="#testimonials"
                                            className="[display:inline-flex] [max-width:100%] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:3px_9px] [font-size:10px] [font-weight:700] [color:#151515] [border:2px_solid_#D70808] [text-decoration:none] max-[639px]:[box-sizing:border-box] max-[639px]:[width:100%] max-[639px]:[padding:clamp(10px,3vw,14px)_clamp(16px,5vw,28px)] max-[639px]:[font-size:clamp(12px,3.6vw,16px)]"
                                        >
                                            Lihat Bukti Alumni →
                                        </a>
                                    </div>

                                    <div
                                        id="hero-rating-line"
                                        className="[display:flex] [flex-wrap:wrap] [align-items:center] [justify-content:center] [gap:8px_12px]"
                                    >
                                        <span className="[display:flex] [align-items:center] [gap:4px] [font-size:12px] [font-weight:600] [color:#6b7280] max-[639px]:[font-size:clamp(9px,2.6vw,12px)]">
                                            ★★★★★{' '}
                                            <span className="[margin-left:4px] max-[639px]:[font-size:clamp(9px,2.6vw,12px)]">
                                                4.9/5 Google Review
                                            </span>
                                        </span>
                                        <span className="[font-size:12px] [color:#6b7280] max-[639px]:[font-size:clamp(9px,2.6vw,12px)]">
                                            •
                                        </span>
                                        <span className="[font-size:12px] [font-weight:600] [color:#6b7280] max-[639px]:[font-size:clamp(9px,2.6vw,12px)]">
                                            45.000+ Alumni Sukses
                                        </span>
                                        <span className="[font-size:12px] [color:#6b7280] max-[639px]:[font-size:clamp(9px,2.6vw,12px)]">
                                            •
                                        </span>
                                        <span className="[font-size:12px] [font-weight:600] [color:#6b7280] max-[639px]:[font-size:clamp(9px,2.6vw,12px)]">
                                            🛡 Garansi 100%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="[grid-column:2] [display:flex] [align-items:flex-end] [justify-content:center] max-[899px]:[grid-column:1] max-[899px]:[margin-top:-4px]">
                                <div className="[position:relative] [display:flex] [width:100%] [max-width:560px] [align-items:flex-end] [justify-content:center] [align-self:stretch] max-[899px]:[max-width:250px] max-[899px]:[align-self:initial]">
                                    <img
                                        src="/assets/hero-consultant.png"
                                        alt="Konsultan Full Bright Indonesia siap membantu persiapan TOEFL kamu"
                                        width="820"
                                        height="1000"
                                        fetchPriority="high"
                                        className="[display:block] [height:auto] [max-height:min(72vh,660px)] [width:100%] [mask-image:linear-gradient(to_bottom,#000_0%,#000_78%,rgba(0,0,0,0.5)_92%,transparent_100%)] [object-fit:contain] [object-position:bottom_center] [filter:drop-shadow(0_18px_40px_rgba(0,0,0,0.16))] [-webkit-mask-image:linear-gradient(to_bottom,#000_0%,#000_78%,rgba(0,0,0,0.5)_92%,transparent_100%)] max-[899px]:[max-height:min(28vh,215px)] max-[899px]:[filter:drop-shadow(0_12px_28px_rgba(0,0,0,0.14))]"
                                    />
                                    <div className="hidden min-[900px]:contents">
                                        <div className="[position:absolute] [bottom:18px] [left:0] [display:flex] [max-width:216px] [align-items:center] [gap:10px] [border-radius:16px] [padding:11px_14px] [box-shadow:0_8px_32px_rgba(0,0,0,0.14)] [background:#fff]">
                                            <span className="[font-size:22px]">
                                                🎓
                                            </span>
                                            <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:12px] [line-height:1.35] [font-weight:900] [color:#151515]">
                                                Alumni kami tersebar di seluruh
                                                dunia
                                            </p>
                                        </div>
                                        <div className="[position:absolute] [top:64px] [right:0] [display:flex] [align-items:center] [gap:6px] [border-radius:16px] [padding:8px_12px] [box-shadow:0_8px_32px_rgba(0,0,0,0.12)] [background:#fff]">
                                            <span className="[color:#F59E0B]">
                                                ★★★★★
                                            </span>
                                            <span className="[margin-left:4px] [font-size:12px] [font-weight:900] [color:#151515]">
                                                4.9
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="[position:relative] [display:flex] [justify-content:center] [padding-bottom:4px]">
                        <div className="[display:flex] [height:52px] [width:52px] [animation:heroBounce_2s_ease-in-out_infinite] [align-items:center] [justify-content:center] [border-radius:9999px] [color:#374151] [background:#F3F4F6] [border:1px_solid_#e5e7eb]">
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 4v14M5 12l7 7 7-7"></path>
                            </svg>
                        </div>
                    </div>

                    <div className="[margin-bottom:-1px] [line-height:0]">
                        <svg
                            viewBox="0 0 1440 56"
                            preserveAspectRatio="none"
                            className="[display:block] [height:56px] [width:100%]"
                        >
                            <path
                                d="M0,28 C240,56 480,0 720,28 C960,56 1200,0 1440,28 L1440,56 L0,56 Z"
                                fill="#F3F3F3"
                            ></path>
                        </svg>
                    </div>
                </section>

                {/* Social Proof Strip: Alumni Abroad */}
                <div className="[overflow:hidden] [padding:32px_0] [background:#F3F3F3]">
                    <p className="[margin:0_0_18px] [text-align:center] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [color:#9ca3af] [text-transform:uppercase]">
                        Alumni Kami Sekarang Kuliah Di
                    </p>
                    <div className="[overflow:hidden] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
                        <div className="[display:flex] [width:max-content] [animation:infiniteScroll_30s_linear_infinite]">
                            <div
                                role="img"
                                aria-label="Universitas Indonesia"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://www.monsoonsim.com/uploads/190972_f18baac4e23711d2723e0f822030a77919694fe0.png)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="Institut Teknologi Bandung"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://upload.wikimedia.org/wikipedia/id/9/95/Logo_Institut_Teknologi_Bandung.png)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="Universitas Gadjah Mada"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://iconlogovector.com/uploads/images/2024/11/lg-673f9e2f068ed-Universitas-Gadjah-Mada.webp)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="IPB University"
                                style={{
                                    backgroundImage: `url("${IPB_LOGO_URL}")`,
                                }}
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="Universitas Airlangga"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(/assets/unair.png)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="Universitas Padjadjaran"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://www.unpad.ac.id/wp-content/uploads/2025/12/logo-unpad-duo.svg)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="Institut Teknologi Sepuluh Nopember"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://katamata.wordpress.com/wp-content/uploads/2009/01/logo-its-biru-transparan.png)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="Universitas Diponegoro"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://bauk.undip.ac.id/wp-content/uploads/2023/11/web-undip-logo-1.png)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="University of Nottingham"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://www.nottingham.ac.uk/Brand/LegacyAssets/images-multimedia/2022/Logos/BrandEvolution-NottinghamBlue.png)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="Universität Stuttgart"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://upload.wikimedia.org/wikipedia/commons/c/cc/Universit%C3%A4t_Stuttgart_Logo.png)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="Universitas Indonesia"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://www.monsoonsim.com/uploads/190972_f18baac4e23711d2723e0f822030a77919694fe0.png)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="Institut Teknologi Bandung"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://upload.wikimedia.org/wikipedia/id/9/95/Logo_Institut_Teknologi_Bandung.png)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="Universitas Gadjah Mada"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://iconlogovector.com/uploads/images/2024/11/lg-673f9e2f068ed-Universitas-Gadjah-Mada.webp)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="IPB University"
                                style={{
                                    backgroundImage: `url("${IPB_LOGO_URL}")`,
                                }}
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="Universitas Airlangga"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(/assets/unair.png)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="Universitas Padjadjaran"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://www.unpad.ac.id/wp-content/uploads/2025/12/logo-unpad-duo.svg)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="Institut Teknologi Sepuluh Nopember"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://katamata.wordpress.com/wp-content/uploads/2009/01/logo-its-biru-transparan.png)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="Universitas Diponegoro"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://bauk.undip.ac.id/wp-content/uploads/2023/11/web-undip-logo-1.png)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="University of Nottingham"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://www.nottingham.ac.uk/Brand/LegacyAssets/images-multimedia/2022/Logos/BrandEvolution-NottinghamBlue.png)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>

                            <div
                                role="img"
                                aria-label="Universität Stuttgart"
                                className="[margin:0_20px] [height:64px] [width:110px] [flex-shrink:0] [background-image:url(https://upload.wikimedia.org/wikipedia/commons/c/cc/Universit%C3%A4t_Stuttgart_Logo.png)] [background-size:contain] [background-position:center] [background-repeat:no-repeat]"
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Problem / Agitation Section */}
                <section
                    id="agitation"
                    className="[padding:56px_24px] [background:#F3F3F3]"
                >
                    <div className="[margin:0_auto] [max-width:672px]">
                        <div className="[margin-bottom:24px] [text-align:center]">
                            <div className="[display:inline-block] [border-radius:9999px] [padding:10px_24px] [font-size:13px] [font-weight:800] [letter-spacing:0.02em] [color:#D70808] [text-transform:uppercase] [box-shadow:0_4px_16px_rgba(0,0,0,0.06)] [background:#fff]">
                                Kamu Sudah Mencoba
                            </div>
                        </div>

                        <h2 className="[margin:0_0_20px] [text-align:center] [font-family:Nunito,sans-serif] [font-size:clamp(28px,3.6vw,42px)] [line-height:1.2] [font-weight:900] [color:#151515]">
                            Sudah Banyak Belajar,
                            <br />
                            <span className="[color:#D70808]">
                                Tapi Kenapa Skor Masih Stuck?
                            </span>
                        </h2>

                        <p className="[margin:0_0_36px] [text-align:left] [font-size:11px] [line-height:1.6] [color:#6b6b6b]">
                            Bukan karena kamu kurang berusaha. Hanya saja,{' '}
                            <b>
                                usahamu belum memberikan hasil yang diharapkan.
                            </b>
                        </p>

                        <div className="[margin-bottom:32px] [overflow:hidden] [border-radius:20px] [box-shadow:0_4px_24px_rgba(0,0,0,0.07)] [background:#fff]">
                            <div className="contents max-[559px]:hidden">
                                <div className="[display:grid] [grid-template-columns:1fr_1fr] [gap:0] [background:#F9F9F9] [border-bottom:1px_solid_#ececec]">
                                    <div className="[padding:16px_18px] [font-family:Nunito,sans-serif] [font-size:14px] [font-weight:900] [color:#151515]">
                                        Yang sudah kamu lakukan
                                    </div>
                                    <div className="[padding:16px_18px] [font-family:Nunito,sans-serif] [font-size:14px] [font-weight:900] [color:#D70808] [border-left:1px_solid_#ececec]">
                                        Yang kamu alami
                                    </div>
                                </div>
                            </div>
                            <div className="hidden max-[559px]:contents">
                                <div className="[padding:15px_16px] [font-family:Nunito,sans-serif] [font-size:14px] [font-weight:900] [color:#151515] [background:#F9F9F9] [border-bottom:1px_solid_#ececec]">
                                    Yang sudah kamu lakukan{' '}
                                    <span className="[color:#D70808]">
                                        → yang kamu alami
                                    </span>
                                </div>
                            </div>

                            <div className="[display:grid] [grid-template-columns:1fr_1fr] [align-items:stretch] [border-bottom:1px_solid_#f2f2f2] max-[559px]:[grid-template-columns:1fr]">
                                <div className="[display:flex] [align-items:flex-start] [gap:12px] [padding:18px] max-[559px]:[padding:16px_16px_10px]">
                                    <span className="[flex-shrink:0] [padding-top:2px] [font-family:Nunito,sans-serif] [font-size:12px] [font-weight:900] [color:#c9c9c9]">
                                        01
                                    </span>
                                    <p className="[margin:0] [font-size:15px] [line-height:1.55] [font-weight:600] [color:#151515]">
                                        Sudah download banyak PDF materi
                                    </p>
                                </div>
                                <div className="[display:flex] [align-items:flex-start] [gap:10px] [padding:18px] [background:#FFFAFA] [border-left:1px_solid_#f2f2f2] max-[559px]:[padding:0_16px_16px_44px] max-[559px]:[background:transparent] max-[559px]:[border-left:initial]">
                                    <p className="[margin:0] [font-size:15px] [line-height:1.55] [font-weight:700] [color:#D70808]">
                                        Tapi bingung mulai dari mana
                                    </p>
                                </div>
                            </div>

                            <div className="[display:grid] [grid-template-columns:1fr_1fr] [align-items:stretch] [border-bottom:1px_solid_#f2f2f2] max-[559px]:[grid-template-columns:1fr]">
                                <div className="[display:flex] [align-items:flex-start] [gap:12px] [padding:18px] max-[559px]:[padding:16px_16px_10px]">
                                    <span className="[flex-shrink:0] [padding-top:2px] [font-family:Nunito,sans-serif] [font-size:12px] [font-weight:900] [color:#c9c9c9]">
                                        02
                                    </span>
                                    <p className="[margin:0] [font-size:15px] [line-height:1.55] [font-weight:600] [color:#151515]">
                                        Sudah nonton banyak video TOEFL
                                    </p>
                                </div>
                                <div className="[display:flex] [align-items:flex-start] [gap:10px] [padding:18px] [background:#FFFAFA] [border-left:1px_solid_#f2f2f2] max-[559px]:[padding:0_16px_16px_44px] max-[559px]:[background:transparent] max-[559px]:[border-left:initial]">
                                    <p className="[margin:0] [font-size:15px] [line-height:1.55] [font-weight:700] [color:#D70808]">
                                        Tapi besoknya lupa lagi materinya
                                    </p>
                                </div>
                            </div>

                            <div className="[display:grid] [grid-template-columns:1fr_1fr] [align-items:stretch] [border-bottom:1px_solid_#f2f2f2] max-[559px]:[grid-template-columns:1fr]">
                                <div className="[display:flex] [align-items:flex-start] [gap:12px] [padding:18px] max-[559px]:[padding:16px_16px_10px]">
                                    <span className="[flex-shrink:0] [padding-top:2px] [font-family:Nunito,sans-serif] [font-size:12px] [font-weight:900] [color:#c9c9c9]">
                                        03
                                    </span>
                                    <p className="[margin:0] [font-size:15px] [line-height:1.55] [font-weight:600] [color:#151515]">
                                        Sudah mengerjakan banyak latihan soal
                                    </p>
                                </div>
                                <div className="[display:flex] [align-items:flex-start] [gap:10px] [padding:18px] [background:#FFFAFA] [border-left:1px_solid_#f2f2f2] max-[559px]:[padding:0_16px_16px_44px] max-[559px]:[background:transparent] max-[559px]:[border-left:initial]">
                                    <p className="[margin:0] [font-size:15px] [line-height:1.55] [font-weight:700] [color:#D70808]">
                                        Tapi kesalahan yang sama terus terulang
                                    </p>
                                </div>
                            </div>

                            <div className="[display:grid] [grid-template-columns:1fr_1fr] [align-items:stretch] [border-bottom:1px_solid_#f2f2f2] max-[559px]:[grid-template-columns:1fr]">
                                <div className="[display:flex] [align-items:flex-start] [gap:12px] [padding:18px] max-[559px]:[padding:16px_16px_10px]">
                                    <span className="[flex-shrink:0] [padding-top:2px] [font-family:Nunito,sans-serif] [font-size:12px] [font-weight:900] [color:#c9c9c9]">
                                        04
                                    </span>
                                    <p className="[margin:0] [font-size:15px] [line-height:1.55] [font-weight:600] [color:#151515]">
                                        Sudah ikut kursus bahasa Inggris
                                    </p>
                                </div>
                                <div className="[display:flex] [align-items:flex-start] [gap:10px] [padding:18px] [background:#FFFAFA] [border-left:1px_solid_#f2f2f2] max-[559px]:[padding:0_16px_16px_44px] max-[559px]:[background:transparent] max-[559px]:[border-left:initial]">
                                    <p className="[margin:0] [font-size:15px] [line-height:1.55] [font-weight:700] [color:#D70808]">
                                        Tapi materinya terlalu umum, bukan pola
                                        TOEFL
                                    </p>
                                </div>
                            </div>

                            <div className="[display:grid] [grid-template-columns:1fr_1fr] [align-items:stretch] max-[559px]:[grid-template-columns:1fr]">
                                <div className="[display:flex] [align-items:flex-start] [gap:12px] [padding:18px] max-[559px]:[padding:16px_16px_10px]">
                                    <span className="[flex-shrink:0] [padding-top:2px] [font-family:Nunito,sans-serif] [font-size:12px] [font-weight:900] [color:#c9c9c9]">
                                        05
                                    </span>
                                    <p className="[margin:0] [font-size:15px] [line-height:1.55] [font-weight:600] [color:#151515]">
                                        Sudah di kursus, berusaha ikutin semua
                                        jadwal kelas
                                    </p>
                                </div>
                                <div className="[display:flex] [align-items:flex-start] [gap:10px] [padding:18px] [background:#FFFAFA] [border-left:1px_solid_#f2f2f2] max-[559px]:[padding:0_16px_16px_44px] max-[559px]:[background:transparent] max-[559px]:[border-left:initial]">
                                    <p className="[margin:0] [font-size:15px] [line-height:1.55] [font-weight:700] [color:#D70808]">
                                        Tapi sekali jadwal bentrok, materi jadi
                                        tertinggal
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="[margin-bottom:32px] [border-radius:20px] [padding:28px_24px] [box-shadow:0_4px_24px_rgba(0,0,0,0.07)] [background:#fff]">
                            <div className="[margin:0_auto] [max-width:520px]">
                                <p className="[margin:0_0_20px] [text-align:center] [font-size:12px] [font-weight:900] [letter-spacing:0.1em] [color:#D70808] [text-transform:uppercase]">
                                    Kalau kamu belajar sendiri
                                </p>
                                <div className="[display:flex] [align-items:flex-end] [justify-content:center] [gap:clamp(20px,6vw,48px)] [padding-bottom:14px] [border-bottom:2px_solid_#151515]">
                                    <div className="[display:flex] [flex-direction:column] [align-items:center] [gap:10px]">
                                        <span className="[font-size:12px] [font-weight:900] [letter-spacing:0.06em] [color:#151515] [text-transform:uppercase]">
                                            Effort kamu
                                        </span>
                                        <div className="[display:flex] [height:clamp(120px,26vw,160px)] [width:clamp(84px,22vw,116px)] [align-items:flex-end] [justify-content:center] [border-radius:10px_10px_0_0] [padding-bottom:12px] [background:#151515]">
                                            <span className="[text-align:center] [font-size:11px] [line-height:1.3] [font-weight:800] [color:rgba(255,255,255,0.75)]">
                                                Waktu &amp;
                                                <br />
                                                tenaga
                                            </span>
                                        </div>
                                    </div>
                                    <div className="[display:flex] [flex-direction:column] [align-items:center] [gap:10px]">
                                        <span className="[font-size:12px] [font-weight:900] [letter-spacing:0.06em] [color:#D70808] [text-transform:uppercase]">
                                            Kenaikan skor
                                        </span>
                                        <div className="[height:clamp(24px,6vw,34px)] [width:clamp(84px,22vw,116px)] [border-radius:10px_10px_0_0] [background:#D70808]"></div>
                                    </div>
                                </div>
                                <p className="[margin:26px_0_0] [text-align:center] [font-family:Nunito,sans-serif] [font-size:18px] [line-height:1.3] [font-weight:900] [color:#151515]">
                                    Effort yang kamu keluarkan{' '}
                                    <span className="[color:#D70808]">
                                        jauh lebih besar daripada kenaikan
                                        skormu.
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="[display:flex] [flex-direction:column] [align-items:center] [gap:8px]">
                        <p className="[margin:0] [text-align:center] [font-size:20px] [line-height:1.5] [font-weight:600] [color:#6b6b6b]">
                            Kamu tidak membutuhkan lebih banyak materi.
                        </p>
                        <p className="[margin:0] [text-align:center] [font-size:20px] [line-height:1.5] [font-weight:700] [color:#151515]">
                            Kamu butuh cara belajar yang terstruktur dan fokus
                            ke pola soal TOEFL
                        </p>
                        <div className="[margin-top:8px] [display:flex] [height:36px] [width:36px] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:18px] [color:#374151] [background:#F3F4F6]">
                            ↓
                        </div>
                    </div>
                </section>
            </div>

            {/* Value Section: comparison + pillars */}
            <div className="[margin-top:-1px] [line-height:0] [background:#F3F3F3]">
                <svg
                    viewBox="0 0 1440 56"
                    preserveAspectRatio="none"
                    className="[display:block] [height:56px] [width:100%]"
                >
                    <path
                        d="M0,28 C240,0 480,56 720,28 C960,0 1200,56 1440,28 L1440,0 L0,0 Z"
                        fill="#ffffff"
                    ></path>
                </svg>
            </div>

            <section
                id="value"
                className="[padding:80px_24px] [background:#fff]"
            >
                <div className="[margin:0_auto] [max-width:1152px]">
                    <div className="[margin-bottom:56px] [text-align:center]">
                        <div className="[margin-bottom:20px] [display:inline-flex] [align-items:center] [gap:8px] [border-radius:9999px] [padding:6px_16px] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [color:#0E7C4A] [text-transform:uppercase] [background:#EAFBF1] [border:1px_solid_#8fdcb4]">
                            💡 Metode Eksklusif Full Bright
                        </div>
                        <h2 className="[margin:0_0_20px] [font-family:Nunito,sans-serif] [font-size:clamp(24px,3vw,36px)] [font-weight:900] [color:#151515]">
                            Ini{' '}
                            <span className="[color:rgb(215,_8,_8)]">
                                Strategi Belajar TOEFL
                            </span>{' '}
                            Yang Tepat Untuk Kamu
                        </h2>
                        <p className="[margin:0] [margin:0_auto] [max-width:576px] [font-size:16px] [line-height:1.6] [color:#3d3d3d]">
                            Ini cara Full Bright membantu{' '}
                            <strong className="[color:rgb(21,_21,_21)]">
                                45.000+ orang
                            </strong>{' '}
                            mengubah submission yang tadinya ditolak jadi
                            diterima di kampus &amp; perusahaan impian mereka.
                        </p>
                    </div>

                    <div className="[margin:0_auto_56px] [max-width:760px] [border-radius:20px] [box-shadow:0_4px_24px_rgba(0,0,0,0.05)] [background:#fff] [border:1px_solid_#ececec]">
                        <div style={css(cmpHeaderStyle(bannerH))}>
                            <div className="[padding:16px] [font-size:12px] [font-weight:900] [letter-spacing:0.08em] [color:#6b7280] [text-transform:uppercase]">
                                Kriteria
                            </div>
                            <div className="[padding:16px_8px] [text-align:center] [font-family:Nunito,sans-serif] [font-size:13px] [line-height:1.25] [font-weight:800] [color:#6b7280]">
                                Belajar Otodidak
                            </div>
                            <div className="[padding:16px_8px] [text-align:center] [font-family:Nunito,sans-serif] [font-size:13px] [line-height:1.25] [font-weight:800] [color:#6b7280]">
                                Kursus Lain
                            </div>
                            <div className="[padding:16px_8px] [text-align:center] [font-family:Nunito,sans-serif] [font-size:13px] [line-height:1.25] [font-weight:900] [color:#fff] [background:#D70808]">
                                Full Bright
                            </div>
                        </div>

                        <div className="[display:grid] [grid-template-columns:1.5fr_0.85fr_0.85fr_0.9fr] [align-items:center] [border-bottom:1px_solid_#f4f4f4]">
                            <div className="[padding:16px] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">
                                Biaya tetap terjangkau
                            </div>
                            <div className="[display:flex] [justify-content:center] [padding:16px_8px]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#fff] [background:#9ca3af]">
                                    ✓
                                </span>
                            </div>
                            <div className="[display:flex] [justify-content:center] [padding:16px_8px]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#b4b4b4] [background:#efefef]">
                                    ✕
                                </span>
                            </div>
                            <div className="[display:flex] [align-items:center] [justify-content:center] [align-self:stretch] [padding:16px_8px] [background:#FFF7F7]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#fff] [background:#D70808]">
                                    ✓
                                </span>
                            </div>
                        </div>

                        <div className="[display:grid] [grid-template-columns:1.5fr_0.85fr_0.85fr_0.9fr] [align-items:center] [border-bottom:1px_solid_#f4f4f4]">
                            <div className="[padding:16px] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">
                                Jadwal bisa kamu atur sendiri
                            </div>
                            <div className="[display:flex] [justify-content:center] [padding:16px_8px]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#fff] [background:#9ca3af]">
                                    ✓
                                </span>
                            </div>
                            <div className="[display:flex] [justify-content:center] [padding:16px_8px]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#b4b4b4] [background:#efefef]">
                                    ✕
                                </span>
                            </div>
                            <div className="[display:flex] [align-items:center] [justify-content:center] [align-self:stretch] [padding:16px_8px] [background:#FFF7F7]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#fff] [background:#D70808]">
                                    ✓
                                </span>
                            </div>
                        </div>

                        <div className="[display:grid] [grid-template-columns:1.5fr_0.85fr_0.85fr_0.9fr] [align-items:center] [border-bottom:1px_solid_#f4f4f4]">
                            <div className="[padding:16px] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">
                                Materi tersusun urut, tidak bingung
                            </div>
                            <div className="[display:flex] [justify-content:center] [padding:16px_8px]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#b4b4b4] [background:#efefef]">
                                    ✕
                                </span>
                            </div>
                            <div className="[display:flex] [justify-content:center] [padding:16px_8px]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#fff] [background:#9ca3af]">
                                    ✓
                                </span>
                            </div>
                            <div className="[display:flex] [align-items:center] [justify-content:center] [align-self:stretch] [padding:16px_8px] [background:#FFF7F7]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#fff] [background:#D70808]">
                                    ✓
                                </span>
                            </div>
                        </div>

                        <div className="[display:grid] [grid-template-columns:1.5fr_0.85fr_0.85fr_0.9fr] [align-items:center] [border-bottom:1px_solid_#f4f4f4]">
                            <div className="[padding:16px] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">
                                Materi khusus pola soal TOEFL
                            </div>
                            <div className="[display:flex] [justify-content:center] [padding:16px_8px]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#b4b4b4] [background:#efefef]">
                                    ✕
                                </span>
                            </div>
                            <div className="[display:flex] [justify-content:center] [padding:16px_8px]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#b4b4b4] [background:#efefef]">
                                    ✕
                                </span>
                            </div>
                            <div className="[display:flex] [align-items:center] [justify-content:center] [align-self:stretch] [padding:16px_8px] [background:#FFF7F7]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#fff] [background:#D70808]">
                                    ✓
                                </span>
                            </div>
                        </div>

                        <div className="[display:grid] [grid-template-columns:1.5fr_0.85fr_0.85fr_0.9fr] [align-items:center] [border-bottom:1px_solid_#f4f4f4]">
                            <div className="[padding:16px] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">
                                Ada yang bisa ditanya kalau bingung
                            </div>
                            <div className="[display:flex] [justify-content:center] [padding:16px_8px]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#b4b4b4] [background:#efefef]">
                                    ✕
                                </span>
                            </div>
                            <div className="[display:flex] [justify-content:center] [padding:16px_8px]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#fff] [background:#9ca3af]">
                                    ✓
                                </span>
                            </div>
                            <div className="[display:flex] [align-items:center] [justify-content:center] [align-self:stretch] [padding:16px_8px] [background:#FFF7F7]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#fff] [background:#D70808]">
                                    ✓
                                </span>
                            </div>
                        </div>

                        <div className="[display:grid] [grid-template-columns:1.5fr_0.85fr_0.85fr_0.9fr] [align-items:center] [border-bottom:1px_solid_#f4f4f4]">
                            <div className="[padding:16px] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">
                                Materi bisa diulang kapan pun
                            </div>
                            <div className="[display:flex] [justify-content:center] [padding:16px_8px]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#fff] [background:#9ca3af]">
                                    ✓
                                </span>
                            </div>
                            <div className="[display:flex] [justify-content:center] [padding:16px_8px]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#b4b4b4] [background:#efefef]">
                                    ✕
                                </span>
                            </div>
                            <div className="[display:flex] [align-items:center] [justify-content:center] [align-self:stretch] [padding:16px_8px] [background:#FFF7F7]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#fff] [background:#D70808]">
                                    ✓
                                </span>
                            </div>
                        </div>

                        <div className="[display:grid] [grid-template-columns:1.5fr_0.85fr_0.85fr_0.9fr] [align-items:center] [border-bottom:1px_solid_#f4f4f4]">
                            <div className="[padding:16px] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">
                                Skor naik signifikan dalam 15 hari
                            </div>
                            <div className="[display:flex] [justify-content:center] [padding:16px_8px]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#b4b4b4] [background:#efefef]">
                                    ✕
                                </span>
                            </div>
                            <div className="[display:flex] [justify-content:center] [padding:16px_8px]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#b4b4b4] [background:#efefef]">
                                    ✕
                                </span>
                            </div>
                            <div className="[display:flex] [align-items:center] [justify-content:center] [align-self:stretch] [padding:16px_8px] [background:#FFF7F7]">
                                <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:13px] [font-weight:900] [color:#fff] [background:#D70808]">
                                    ✓
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="[margin:0_auto_18px] [max-width:560px]">
                        <div className="[overflow:hidden] [border-radius:16px] [line-height:0] [box-shadow:0_3px_16px_rgba(0,0,0,0.05)] [background:#fff] [border:1px_solid_#ececec]">
                            <img
                                src="/assets/pasted-1788585564773-0.png"
                                alt="Instruktur Full Bright menjelaskan pola soal TOEFL di kelas"
                                className="[display:block] [height:auto] [width:100%]"
                            />
                        </div>
                    </div>
                    <p className="[margin:0_auto_28px] [max-width:820px] [text-align:center] [font-size:19px] [line-height:1.6] [font-weight:800] [color:#151515]">
                        3 Metode Belajar yang Membuat Alumni Full Bright Naik
                        Skor dalam 15 Hari:
                    </p>

                    <div className="[margin-bottom:40px] [display:grid] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] [gap:16px]">
                        <div className="[display:flex] [flex-direction:column] [gap:16px] [border-radius:16px] [padding:28px] [box-shadow:0_4px_24px_rgba(0,0,0,0.06)] [background:#fff] [border-left:4px_solid_#D70808] [border:1px_solid_#f3f4f6]">
                            <div className="[display:flex] [height:48px] [width:48px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:16px] [font-size:22px] [background:#FFF0F0]">
                                🎯
                            </div>
                            <h3 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [line-height:1.3] [font-weight:900] [color:#151515]">
                                TOEFL Pattern Recognition Method™
                            </h3>
                            <p className="[margin:0] [font-size:14px] [line-height:1.7] [color:#3d3d3d]">
                                Belajar pola soal yang paling sering muncul agar
                                target skor lebih cepat tercapai, tanpa
                                menghabiskan waktu mempelajari semua materi.
                            </p>
                        </div>

                        <div className="[display:flex] [flex-direction:column] [gap:16px] [border-radius:16px] [padding:28px] [box-shadow:0_4px_24px_rgba(0,0,0,0.06)] [background:#fff] [border-left:4px_solid_#151515] [border:1px_solid_#f3f4f6]">
                            <div className="[display:flex] [height:48px] [width:48px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:16px] [font-size:22px] [background:#F3F3F3]">
                                ⚡
                            </div>
                            <h3 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [line-height:1.3] [font-weight:900] [color:#151515]">
                                Shortcut Structure Framework™
                            </h3>
                            <p className="[margin:0] [font-size:14px] [line-height:1.7] [color:#3d3d3d]">
                                Roadmap belajar disesuaikan dengan target skor,
                                sehingga kamu fokus pada materi yang paling
                                berdampak untuk mencapai skor.
                            </p>
                        </div>

                        <div className="[display:flex] [flex-direction:column] [gap:16px] [border-radius:16px] [padding:28px] [box-shadow:0_4px_24px_rgba(0,0,0,0.06)] [background:#fff] [border-left:4px_solid_#D70808] [border:1px_solid_#f3f4f6]">
                            <div className="[display:flex] [height:48px] [width:48px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:16px] [font-size:22px] [background:#FFF0F0]">
                                📈
                            </div>
                            <h3 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [line-height:1.3] [font-weight:900] [color:#151515]">
                                Score-Focused Learning System™
                            </h3>
                            <p className="[margin:0] [font-size:14px] [line-height:1.7] [color:#3d3d3d]">
                                Setiap sesi belajar difokuskan pada target skor
                                yang dibutuhkan, sehingga progresmu selalu
                                mengarah ke tujuan yang jelas.
                            </p>
                        </div>
                    </div>

                    <div className="[text-align:center]">
                        <div className="[display:flex] [flex-wrap:wrap] [justify-content:center] [gap:12px]">
                            <TrackedCTA
                                zone="midpage"
                                action="scroll"
                                label="Gabung Sekarang"
                                href="#pricing"
                                onClick={scrollToPricing}
                                className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:14px_28px] [font-size:16px] [font-weight:700] [color:#fff] [box-shadow:0_4px_20px_rgba(215,8,8,0.35)] [background:#D70808] [text-decoration:none]"
                            >
                                Gabung Sekarang →
                            </TrackedCTA>
                            <a
                                href="#testimonials"
                                className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:14px_28px] [font-size:16px] [font-weight:700] [color:#151515] [border:2px_solid_#D70808] [text-decoration:none]"
                            >
                                Lihat Bukti Alumni →
                            </a>
                        </div>
                        <div className="[margin-top:12px] [display:flex] [flex-wrap:wrap] [align-items:center] [justify-content:center] [gap:8px_12px]">
                            <span className="[display:flex] [align-items:center] [gap:4px] [font-size:12px] [font-weight:600] [color:#6b7280]">
                                ★★★★★
                                <span className="[margin-left:4px]">
                                    4.9/5 Google Review
                                </span>
                            </span>
                            <span className="[font-size:12px] [color:#6b7280]">
                                •
                            </span>
                            <span className="[font-size:12px] [font-weight:600] [color:#6b7280]">
                                45.000+ Alumni Sukses
                            </span>
                            <span className="[font-size:12px] [color:#6b7280]">
                                •
                            </span>
                            <span className="[font-size:12px] [font-weight:600] [color:#6b7280]">
                                🛡 Garansi 100%
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof: WA screenshots */}
            <section
                id="proof"
                className="[padding:72px_24px] [background:#fff]"
            >
                <div className="[margin:0_auto] [max-width:672px]">
                    <div className="[margin-bottom:36px] [text-align:center]">
                        <div className="[margin-bottom:20px] [display:inline-flex] [align-items:center] [gap:8px] [border-radius:9999px] [padding:6px_16px] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [color:#D70808] [text-transform:uppercase] [background:#FFF0F0] [border:1px_solid_#ffb3b3]">
                            📱 Bukti Nyata dari Alumni
                        </div>
                        <h2 className="[margin:0_0_14px] [font-family:Nunito,sans-serif] [font-size:clamp(24px,3vw,36px)] [line-height:1.25] [font-weight:900] [color:#151515]">
                            Metode Kami Berhasil Membuat
                            <br />
                            <span className="[color:#7c3aed]">
                                <span className="[font-size:26.46px]">
                                    Ribuan Alumni Kami Capai TOEFL 500+&nbsp;
                                </span>
                            </span>
                        </h2>

                        <p className="[margin:0] [font-size:14px] [color:#9ca3af]">
                            Klik foto untuk memperbesar
                        </p>
                    </div>

                    <div className="[margin:0_auto_32px] [display:flex] [max-width:980px] [flex-direction:column]">
                        <div
                            className="[display:flex] [cursor:pointer] [flex-direction:column] [align-items:center] [gap:10px] [padding:20px_0] [border-bottom:1px_solid_#e5e7eb]"
                            onClick={() => setLightboxIdx(0)}
                        >
                            <p className="[margin:0] [width:100%] [text-align:left] [font-family:Nunito,sans-serif] [font-size:11px] [font-weight:800] [color:#151515]">
                                Skor{' '}
                                <span className="[color:#D70808]">547</span>
                            </p>
                            <div className="[aspect-ratio:16/9] [width:100%] [overflow:hidden] [border-radius:14px] [background-image:url(/assets/toefl1.webp)] [background-size:cover] [background-position:center] [box-shadow:0_6px_24px_rgba(0,0,0,0.18)]"></div>
                        </div>

                        <div
                            className="[display:flex] [cursor:pointer] [flex-direction:column] [align-items:center] [gap:10px] [padding:20px_0] [border-bottom:1px_solid_#e5e7eb]"
                            onClick={() => setLightboxIdx(1)}
                        >
                            <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:18px] [font-weight:800] [color:#151515]">
                                Skor{' '}
                                <span className="[color:#D70808]">543</span>
                            </p>
                            <div className="[aspect-ratio:16/9] [width:100%] [overflow:hidden] [border-radius:14px] [background-image:url(/assets/toefl2.webp)] [background-size:cover] [background-position:center] [box-shadow:0_6px_24px_rgba(0,0,0,0.18)]"></div>
                        </div>

                        <div
                            className="[display:flex] [cursor:pointer] [flex-direction:column] [align-items:center] [gap:10px] [padding:20px_0] [border-bottom:1px_solid_#e5e7eb]"
                            onClick={() => setLightboxIdx(2)}
                        >
                            <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:18px] [font-weight:800] [color:#151515]">
                                Skor{' '}
                                <span className="[color:#D70808]">563</span>
                            </p>
                            <div className="[aspect-ratio:16/9] [width:100%] [overflow:hidden] [border-radius:14px] [background-image:url(/assets/toefl3.webp)] [background-size:cover] [background-position:center] [box-shadow:0_6px_24px_rgba(0,0,0,0.18)]"></div>
                        </div>
                    </div>

                    <div className="[text-align:center]">
                        <div className="[display:flex] [flex-wrap:wrap] [justify-content:center] [gap:12px]">
                            <TrackedCTA
                                zone="midpage"
                                action="scroll"
                                label="Gabung Sekarang"
                                href="#pricing"
                                onClick={scrollToPricing}
                                className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:14px_28px] [font-size:16px] [font-weight:700] [color:#fff] [box-shadow:0_4px_20px_rgba(215,8,8,0.35)] [background:#D70808] [text-decoration:none]"
                            >
                                Gabung Sekarang →
                            </TrackedCTA>
                            <a
                                href="#testimonials"
                                className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:4px_10px] [font-size:11px] [font-weight:700] [color:#151515] [border:2px_solid_#D70808] [text-decoration:none]"
                            >
                                Lihat Lebih Banyak Bukti →
                            </a>
                        </div>
                        <div className="[margin-top:12px] [display:flex] [flex-wrap:wrap] [align-items:center] [justify-content:center] [gap:8px_12px]">
                            <span className="[display:flex] [align-items:center] [gap:4px] [font-size:12px] [font-weight:600] [color:#6b7280]">
                                ★★★★★
                                <span className="[margin-left:4px]">
                                    4.9/5 Google Review
                                </span>
                            </span>
                            <span className="[font-size:12px] [color:#6b7280]">
                                •
                            </span>
                            <span className="[font-size:12px] [font-weight:600] [color:#6b7280]">
                                45.000+ Alumni Sukses
                            </span>
                            <span className="[font-size:12px] [color:#6b7280]">
                                •
                            </span>
                            <span className="[font-size:12px] [font-weight:600] [color:#6b7280]">
                                🛡 Garansi 100%
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* LMS Preview */}
            <section
                id="lms"
                className="[padding:210px_24px_190px] [background:#fff]"
            >
                <div className="[margin:0_auto] [max-width:1152px]">
                    <div className="[margin-bottom:48px] [text-align:center]">
                        <div className="[margin-bottom:20px] [display:inline-flex] [align-items:center] [gap:8px] [border-radius:9999px] [padding:6px_16px] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [color:#D70808] [text-transform:uppercase] [background:#FFF0F0] [border:1px_solid_#ffb3b3]">
                            💻 Tampilan LMS
                        </div>
                        <h2 className="[margin:0_0_16px] [font-family:Nunito,sans-serif] [font-size:clamp(24px,3vw,36px)] [font-weight:900] [color:#151515]">
                            Intip Langsung{' '}
                            <span className="[color:#D70808]">
                                Platform Belajarnya
                            </span>
                        </h2>
                        <p className="[margin:0] [margin-right:auto] [margin-left:auto] [max-width:560px] [font-size:16px] [line-height:1.6] [color:#3d3d3d]">
                            Semua yang kamu butuhkan untuk mengetahui kelemahan,
                            belajar, berlatih, dan menghadapi ujian.
                        </p>
                    </div>

                    <div className="[position:relative] [margin:0_auto_40px] [max-width:1040px] [overflow:hidden] [border-radius:18px] [line-height:0] [box-shadow:0_8px_28px_rgba(0,0,0,0.18)] [background:#151515]">
                        <video
                            ref={lmsVideoRef}
                            controls
                            preload="metadata"
                            playsInline
                            onPlay={() => setShowLmsOverlay(false)}
                            className="[display:block] [aspect-ratio:16/9] [width:100%] [object-fit:cover] [background:#151515]"
                        >
                            <source
                                src="https://demo-fullbright.b-cdn.net/NEW.mp4#t=4"
                                type="video/mp4"
                            />
                            Browser kamu tidak mendukung pemutaran video.
                        </video>
                        {showLmsOverlay ? (
                            <button
                                type="button"
                                aria-label="Putar video tampilan LMS"
                                onClick={playLmsVideo}
                                className="[position:absolute] [inset:0] [display:flex] [cursor:pointer] [align-items:center] [justify-content:center] [background:rgba(21,21,21,0.22)] [border:0] [transition:background_0.2s_ease] hover:[background:rgba(21,21,21,0.32)]"
                            >
                                <div className="[position:absolute] [inset:0] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [gap:14px] [background:rgba(21,21,21,0.35)]">
                                    <span className="[display:flex] [height:76px] [width:76px] [align-items:center] [justify-content:center] [border-radius:9999px] [box-shadow:0_8px_28px_rgba(215,8,8,0.5)] [background:#D70808]">
                                        <svg
                                            width="30"
                                            height="30"
                                            viewBox="0 0 24 24"
                                            fill="#fff"
                                        >
                                            <path d="M8 5.5v13l11-6.5z"></path>
                                        </svg>
                                    </span>
                                    <span className="[font-family:Nunito,sans-serif] [font-size:13px] [font-weight:800] [color:#fff] [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">
                                        Putar showcase LMS
                                    </span>
                                </div>
                            </button>
                        ) : null}
                    </div>

                    <div className="[margin:0_auto_40px] [display:flex] [max-width:1040px] [flex-direction:column] [gap:20px]">
                        <div className="[display:grid] [grid-template-columns:1.35fr_1fr] [align-items:stretch] [overflow:hidden] [border-radius:22px] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#ececec] max-[899px]:[grid-template-columns:1fr]">
                            <div className="[display:flex] [flex-direction:column] [justify-content:center] [padding:22px] [background:#FAFAFA]">
                                <div className="[overflow:hidden] [border-radius:12px] [line-height:0] [box-shadow:0_4px_18px_rgba(0,0,0,0.09)] [background:#fff] [border:1px_solid_#e5e7eb]">
                                    <div
                                        role="img"
                                        aria-label="Tidak Lagi Bingung Harus Mulai dari Mana"
                                        className="[display:flex] [aspect-ratio:16/9] [width:100%] [align-items:center] [justify-content:center] [font-size:14px] [font-weight:900] [letter-spacing:0.04em] [color:#D70808] [background:linear-gradient(135deg,#fff_0%,#FFF0F0_100%)]"
                                    >
                                        Diagnostic Test
                                    </div>
                                </div>
                            </div>
                            <div className="[display:flex] [flex-direction:column] [justify-content:center] [gap:11px] [padding:24px_26px]">
                                <div className="[display:flex] [flex-wrap:wrap] [align-items:center] [gap:10px]">
                                    <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9px] [font-family:Nunito,sans-serif] [font-size:12px] [font-weight:900] [color:#fff] [background:#D70808]">
                                        01
                                    </span>
                                    <span className="[font-size:11px] [font-weight:900] [letter-spacing:0.08em] [color:#9ca3af] [text-transform:uppercase]">
                                        Diagnostic Test
                                    </span>
                                    <span className="[display:inline-flex] [align-items:baseline] [gap:5px] [border-radius:9999px] [padding:6px_13px] [font-family:Nunito,sans-serif] [font-size:15px] [font-weight:900] [white-space:nowrap] [color:#D70808] [background:#FFF0F0] [border:1.5px_solid_#ffb3b3]">
                                        <span className="[font-size:10px] [font-weight:900] [letter-spacing:0.06em] [color:#c96b6b] [text-transform:uppercase]">
                                            Senilai
                                        </span>
                                        Rp 120.000
                                    </span>
                                </div>
                                <h3 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:clamp(19px,2.2vw,22px)] [line-height:1.3] [font-weight:900] [color:#151515]">
                                    Tidak Lagi Bingung Harus Mulai dari Mana
                                </h3>
                                <p className="[margin:0] [font-size:15px] [line-height:1.7] [color:#3d3d3d]">
                                    Kerjakan Diagnostic Test lebih dulu untuk
                                    mengetahui baseline skor TOEFL ITP kamu.
                                    Hasilnya menentukan materi mana yang perlu
                                    diprioritaskan.
                                </p>
                                <div className="[margin-top:2px] [display:flex] [flex-wrap:wrap] [gap:7px]">
                                    <span className="[display:inline-flex] [flex-shrink:0] [align-items:center] [gap:6px] [border-radius:9999px] [padding:6px_12px] [font-size:13px] [font-weight:700] [white-space:nowrap] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec]">
                                        <span className="[font-weight:900] [color:#D70808]">
                                            ✓
                                        </span>
                                        Baseline skor per section
                                    </span>

                                    <span className="[display:inline-flex] [flex-shrink:0] [align-items:center] [gap:6px] [border-radius:9999px] [padding:6px_12px] [font-size:13px] [font-weight:700] [white-space:nowrap] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec]">
                                        <span className="[font-weight:900] [color:#D70808]">
                                            ✓
                                        </span>
                                        Materi prioritas otomatis
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="[display:grid] [grid-template-columns:1fr_1.35fr] [align-items:stretch] [overflow:hidden] [border-radius:22px] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#ececec] max-[899px]:[grid-template-columns:1fr]">
                            <div className="[order:2] [display:flex] [flex-direction:column] [justify-content:center] [padding:22px] [background:#FAFAFA] max-[899px]:[order:initial]">
                                <div className="[overflow:hidden] [border-radius:12px] [line-height:0] [box-shadow:0_4px_18px_rgba(0,0,0,0.09)] [background:#fff] [border:1px_solid_#e5e7eb]">
                                    <img
                                        src="/assets/materi.gif"
                                        alt="Materi Sudah Urut, Kamu Tinggal Mengikuti"
                                        className="[display:block] [height:auto] [width:100%]"
                                    />
                                </div>
                            </div>
                            <div className="[order:1] [display:flex] [flex-direction:column] [justify-content:center] [gap:11px] [padding:24px_26px] max-[899px]:[order:initial]">
                                <div className="[display:flex] [flex-wrap:wrap] [align-items:center] [gap:10px]">
                                    <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9px] [font-family:Nunito,sans-serif] [font-size:12px] [font-weight:900] [color:#fff] [background:#D70808]">
                                        02
                                    </span>
                                    <span className="[font-size:11px] [font-weight:900] [letter-spacing:0.08em] [color:#9ca3af] [text-transform:uppercase]">
                                        Materi &amp; Roadmap
                                    </span>
                                    <span className="[display:inline-flex] [align-items:baseline] [gap:5px] [border-radius:9999px] [padding:6px_13px] [font-family:Nunito,sans-serif] [font-size:15px] [font-weight:900] [white-space:nowrap] [color:#D70808] [background:#FFF0F0] [border:1.5px_solid_#ffb3b3]">
                                        <span className="[font-size:10px] [font-weight:900] [letter-spacing:0.06em] [color:#c96b6b] [text-transform:uppercase]">
                                            Senilai
                                        </span>
                                        Rp 300.000
                                    </span>
                                </div>
                                <h3 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:clamp(19px,2.2vw,22px)] [line-height:1.3] [font-weight:900] [color:#151515]">
                                    Materi Sudah Urut, Kamu Tinggal Mengikuti
                                </h3>
                                <p className="[margin:0] [font-size:15px] [line-height:1.7] [color:#3d3d3d]">
                                    Materi Structure, Listening, dan Reading
                                    tersusun rapi dari Hari 1 sampai Hari 15,
                                    jadi kamu tidak perlu menyusun sendiri
                                    urutan belajarnya.
                                </p>
                                <div className="[margin-top:2px] [display:flex] [flex-wrap:wrap] [gap:7px]">
                                    <span className="[display:inline-flex] [flex-shrink:0] [align-items:center] [gap:6px] [border-radius:9999px] [padding:6px_12px] [font-size:13px] [font-weight:700] [white-space:nowrap] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec]">
                                        <span className="[font-weight:900] [color:#D70808]">
                                            ✓
                                        </span>
                                        60 video full skills
                                    </span>

                                    <span className="[display:inline-flex] [flex-shrink:0] [align-items:center] [gap:6px] [border-radius:9999px] [padding:6px_12px] [font-size:13px] [font-weight:700] [white-space:nowrap] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec]">
                                        <span className="[font-weight:900] [color:#D70808]">
                                            ✓
                                        </span>
                                        Urut Hari 1–15
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="[display:grid] [grid-template-columns:1.35fr_1fr] [align-items:stretch] [overflow:hidden] [border-radius:22px] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#ececec] max-[899px]:[grid-template-columns:1fr]">
                            <div className="[display:flex] [flex-direction:column] [justify-content:center] [padding:22px] [background:#FAFAFA]">
                                <div className="[overflow:hidden] [border-radius:12px] [line-height:0] [box-shadow:0_4px_18px_rgba(0,0,0,0.09)] [background:#fff] [border:1px_solid_#e5e7eb]">
                                    <img
                                        src="/assets/video-ai.gif"
                                        alt="Kalau Bingung, Ada yang Langsung Menjawab"
                                        className="[display:block] [height:auto] [width:100%]"
                                    />
                                </div>
                            </div>
                            <div className="[display:flex] [flex-direction:column] [justify-content:center] [gap:11px] [padding:24px_26px]">
                                <div className="[display:flex] [flex-wrap:wrap] [align-items:center] [gap:10px]">
                                    <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9px] [font-family:Nunito,sans-serif] [font-size:12px] [font-weight:900] [color:#fff] [background:#D70808]">
                                        03
                                    </span>
                                    <span className="[font-size:11px] [font-weight:900] [letter-spacing:0.08em] [color:#9ca3af] [text-transform:uppercase]">
                                        AI Assistant
                                    </span>
                                    <span className="[display:inline-flex] [align-items:baseline] [gap:5px] [border-radius:9999px] [padding:6px_13px] [font-family:Nunito,sans-serif] [font-size:15px] [font-weight:900] [white-space:nowrap] [color:#D70808] [background:#FFF0F0] [border:1.5px_solid_#ffb3b3]">
                                        <span className="[font-size:10px] [font-weight:900] [letter-spacing:0.06em] [color:#c96b6b] [text-transform:uppercase]">
                                            Senilai
                                        </span>
                                        Rp 100.000
                                    </span>
                                </div>
                                <h3 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:clamp(19px,2.2vw,22px)] [line-height:1.3] [font-weight:900] [color:#151515]">
                                    Kalau Bingung, Ada yang Langsung Menjawab
                                </h3>
                                <p className="[margin:0] [font-size:15px] [line-height:1.7] [color:#3d3d3d]">
                                    Setiap video dilengkapi rangkuman materi dan
                                    AI Assistant yang siap menjelaskan ulang
                                    topik yang belum kamu pahami, tanpa perlu
                                    menunggu jadwal.
                                </p>
                                <div className="[margin-top:2px] [display:flex] [flex-wrap:wrap] [gap:7px]">
                                    <span className="[display:inline-flex] [flex-shrink:0] [align-items:center] [gap:6px] [border-radius:9999px] [padding:6px_12px] [font-size:13px] [font-weight:700] [white-space:nowrap] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec]">
                                        <span className="[font-weight:900] [color:#D70808]">
                                            ✓
                                        </span>
                                        Rangkuman tiap video
                                    </span>

                                    <span className="[display:inline-flex] [flex-shrink:0] [align-items:center] [gap:6px] [border-radius:9999px] [padding:6px_12px] [font-size:13px] [font-weight:700] [white-space:nowrap] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec]">
                                        <span className="[font-weight:900] [color:#D70808]">
                                            ✓
                                        </span>
                                        Tanya AI 24/7
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="[display:grid] [grid-template-columns:1fr_1.35fr] [align-items:stretch] [overflow:hidden] [border-radius:22px] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#ececec] max-[899px]:[grid-template-columns:1fr]">
                            <div className="[order:2] [display:flex] [flex-direction:column] [justify-content:center] [padding:22px] [background:#FAFAFA] max-[899px]:[order:initial]">
                                <div className="[overflow:hidden] [border-radius:12px] [line-height:0] [box-shadow:0_4px_18px_rgba(0,0,0,0.09)] [background:#fff] [border:1px_solid_#e5e7eb]">
                                    <img
                                        src="/assets/latihan.gif"
                                        alt="Tahu Persis Bagian yang Belum Kamu Kuasai"
                                        className="[display:block] [height:auto] [width:100%]"
                                    />
                                </div>
                            </div>
                            <div className="[order:1] [display:flex] [flex-direction:column] [justify-content:center] [gap:11px] [padding:24px_26px] max-[899px]:[order:initial]">
                                <div className="[display:flex] [flex-wrap:wrap] [align-items:center] [gap:10px]">
                                    <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9px] [font-family:Nunito,sans-serif] [font-size:12px] [font-weight:900] [color:#fff] [background:#D70808]">
                                        04
                                    </span>
                                    <span className="[font-size:11px] [font-weight:900] [letter-spacing:0.08em] [color:#9ca3af] [text-transform:uppercase]">
                                        Latihan Soal
                                    </span>
                                    <span className="[display:inline-flex] [align-items:baseline] [gap:5px] [border-radius:9999px] [padding:6px_13px] [font-family:Nunito,sans-serif] [font-size:15px] [font-weight:900] [white-space:nowrap] [color:#D70808] [background:#FFF0F0] [border:1.5px_solid_#ffb3b3]">
                                        <span className="[font-size:10px] [font-weight:900] [letter-spacing:0.06em] [color:#c96b6b] [text-transform:uppercase]">
                                            Senilai
                                        </span>
                                        Rp 150.000
                                    </span>
                                </div>
                                <h3 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:clamp(19px,2.2vw,22px)] [line-height:1.3] [font-weight:900] [color:#151515]">
                                    Tahu Persis Bagian yang Belum Kamu Kuasai
                                </h3>
                                <p className="[margin:0] [font-size:15px] [line-height:1.7] [color:#3d3d3d]">
                                    Setiap topik punya latihan soal dengan
                                    navigasi antar nomor dan progress tracker,
                                    jadi kamu tahu persis bagian mana yang belum
                                    dikuasai.
                                </p>
                                <div className="[margin-top:2px] [display:flex] [flex-wrap:wrap] [gap:7px]">
                                    <span className="[display:inline-flex] [flex-shrink:0] [align-items:center] [gap:6px] [border-radius:9999px] [padding:6px_12px] [font-size:13px] [font-weight:700] [white-space:nowrap] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec]">
                                        <span className="[font-weight:900] [color:#D70808]">
                                            ✓
                                        </span>
                                        Latihan per topik
                                    </span>

                                    <span className="[display:inline-flex] [flex-shrink:0] [align-items:center] [gap:6px] [border-radius:9999px] [padding:6px_12px] [font-size:13px] [font-weight:700] [white-space:nowrap] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec]">
                                        <span className="[font-weight:900] [color:#D70808]">
                                            ✓
                                        </span>
                                        Progress tracker
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="[display:grid] [grid-template-columns:1.35fr_1fr] [align-items:stretch] [overflow:hidden] [border-radius:22px] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#ececec] max-[899px]:[grid-template-columns:1fr]">
                            <div className="[display:flex] [flex-direction:column] [justify-content:center] [padding:22px] [background:#FAFAFA]">
                                <div className="[overflow:hidden] [border-radius:12px] [line-height:0] [box-shadow:0_4px_18px_rgba(0,0,0,0.09)] [background:#fff] [border:1px_solid_#e5e7eb]">
                                    <img
                                        src="/assets/drill.gif"
                                        alt="Kesalahan yang Sama Tidak Terulang Lagi"
                                        className="[display:block] [height:auto] [width:100%]"
                                    />
                                </div>
                            </div>
                            <div className="[display:flex] [flex-direction:column] [justify-content:center] [gap:11px] [padding:24px_26px]">
                                <div className="[display:flex] [flex-wrap:wrap] [align-items:center] [gap:10px]">
                                    <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9px] [font-family:Nunito,sans-serif] [font-size:12px] [font-weight:900] [color:#fff] [background:#D70808]">
                                        05
                                    </span>
                                    <span className="[font-size:11px] [font-weight:900] [letter-spacing:0.08em] [color:#9ca3af] [text-transform:uppercase]">
                                        Drill Soal
                                    </span>
                                    <span className="[display:inline-flex] [align-items:baseline] [gap:5px] [border-radius:9999px] [padding:6px_13px] [font-family:Nunito,sans-serif] [font-size:15px] [font-weight:900] [white-space:nowrap] [color:#D70808] [background:#FFF0F0] [border:1.5px_solid_#ffb3b3]">
                                        <span className="[font-size:10px] [font-weight:900] [letter-spacing:0.06em] [color:#c96b6b] [text-transform:uppercase]">
                                            Senilai
                                        </span>
                                        Rp 100.000
                                    </span>
                                </div>
                                <h3 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:clamp(19px,2.2vw,22px)] [line-height:1.3] [font-weight:900] [color:#151515]">
                                    Kesalahan yang Sama Tidak Terulang Lagi
                                </h3>
                                <p className="[margin:0] [font-size:15px] [line-height:1.7] [color:#3d3d3d]">
                                    Asah kemampuan spesifik lewat drill per
                                    skill — Listening, Structure, dan Reading —
                                    dengan paket soal yang bisa diulang sampai
                                    benar-benar paham.
                                </p>
                                <div className="[margin-top:2px] [display:flex] [flex-wrap:wrap] [gap:7px]">
                                    <span className="[display:inline-flex] [flex-shrink:0] [align-items:center] [gap:6px] [border-radius:9999px] [padding:6px_12px] [font-size:13px] [font-weight:700] [white-space:nowrap] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec]">
                                        <span className="[font-weight:900] [color:#D70808]">
                                            ✓
                                        </span>
                                        84 paket drill
                                    </span>

                                    <span className="[display:inline-flex] [flex-shrink:0] [align-items:center] [gap:6px] [border-radius:9999px] [padding:6px_12px] [font-size:13px] [font-weight:700] [white-space:nowrap] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec]">
                                        <span className="[font-weight:900] [color:#D70808]">
                                            ✓
                                        </span>
                                        Bisa diulang tanpa batas
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="[display:grid] [grid-template-columns:1fr_1.35fr] [align-items:stretch] [overflow:hidden] [border-radius:22px] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#ececec] max-[899px]:[grid-template-columns:1fr]">
                            <div className="[order:2] [display:flex] [flex-direction:column] [justify-content:center] [padding:22px] [background:#FAFAFA] max-[899px]:[order:initial]">
                                <div className="[overflow:hidden] [border-radius:12px] [line-height:0] [box-shadow:0_4px_18px_rgba(0,0,0,0.09)] [background:#fff] [border:1px_solid_#e5e7eb]">
                                    <img
                                        src="/assets/simulasi.gif"
                                        alt="Supaya Nanti Saat Tes TOEFL Asli Tidak Kaget"
                                        className="[display:block] [height:auto] [width:100%]"
                                    />
                                </div>
                            </div>
                            <div className="[order:1] [display:flex] [flex-direction:column] [justify-content:center] [gap:11px] [padding:24px_26px] max-[899px]:[order:initial]">
                                <div className="[display:flex] [flex-wrap:wrap] [align-items:center] [gap:10px]">
                                    <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9px] [font-family:Nunito,sans-serif] [font-size:12px] [font-weight:900] [color:#fff] [background:#D70808]">
                                        06
                                    </span>
                                    <span className="[font-size:11px] [font-weight:900] [letter-spacing:0.08em] [color:#9ca3af] [text-transform:uppercase]">
                                        Simulasi &amp; Ujian
                                    </span>
                                    <span className="[display:inline-flex] [align-items:baseline] [gap:5px] [border-radius:9999px] [padding:6px_13px] [font-family:Nunito,sans-serif] [font-size:15px] [font-weight:900] [white-space:nowrap] [color:#D70808] [background:#FFF0F0] [border:1.5px_solid_#ffb3b3]">
                                        <span className="[font-size:10px] [font-weight:900] [letter-spacing:0.06em] [color:#c96b6b] [text-transform:uppercase]">
                                            Senilai
                                        </span>
                                        Rp 150.000
                                    </span>

                                    <span className="[border-radius:9999px] [padding:4px_9px] [font-size:10px] [font-weight:800] [color:#D70808] [background:#FFF0F0] [border:1px_solid_#ffb3b3]">
                                        Khusus Dibimbing Tutor
                                    </span>
                                </div>
                                <h3 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:clamp(19px,2.2vw,22px)] [line-height:1.3] [font-weight:900] [color:#151515]">
                                    Supaya Nanti Saat Tes TOEFL Asli Tidak Kaget
                                </h3>
                                <p className="[margin:0] [font-size:15px] [line-height:1.7] [color:#3d3d3d]">
                                    Mode Simulasi tanpa timer dengan feedback
                                    instan untuk latihan, dan Mode Final dengan
                                    timer serta kondisi seperti ujian TOEFL ITP
                                    sebenarnya.
                                </p>
                                <div className="[margin-top:2px] [display:flex] [flex-wrap:wrap] [gap:7px]">
                                    <span className="[display:inline-flex] [flex-shrink:0] [align-items:center] [gap:6px] [border-radius:9999px] [padding:6px_12px] [font-size:13px] [font-weight:700] [white-space:nowrap] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec]">
                                        <span className="[font-weight:900] [color:#D70808]">
                                            ✓
                                        </span>
                                        Mode latihan + feedback
                                    </span>

                                    <span className="[display:inline-flex] [flex-shrink:0] [align-items:center] [gap:6px] [border-radius:9999px] [padding:6px_12px] [font-size:13px] [font-weight:700] [white-space:nowrap] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec]">
                                        <span className="[font-weight:900] [color:#D70808]">
                                            ✓
                                        </span>
                                        Mode Final bertimer
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="[display:grid] [grid-template-columns:1.35fr_1fr] [align-items:stretch] [overflow:hidden] [border-radius:22px] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#ececec] max-[899px]:[grid-template-columns:1fr]">
                            <div className="[display:flex] [flex-direction:column] [justify-content:center] [padding:22px] [background:#FAFAFA]">
                                <div className="[overflow:hidden] [border-radius:12px] [line-height:0] [box-shadow:0_4px_18px_rgba(0,0,0,0.09)] [background:#fff] [border:1px_solid_#e5e7eb]">
                                    <div
                                        role="img"
                                        aria-label="Progresmu Terlihat, Bukan Cuma Terasa Sibuk"
                                        className="[display:flex] [aspect-ratio:16/9] [width:100%] [align-items:center] [justify-content:center] [font-size:14px] [font-weight:900] [letter-spacing:0.04em] [color:#D70808] [background:linear-gradient(135deg,#fff_0%,#FFF0F0_100%)]"
                                    >
                                        Dashboard Progres
                                    </div>
                                </div>
                            </div>
                            <div className="[display:flex] [flex-direction:column] [justify-content:center] [gap:11px] [padding:24px_26px]">
                                <div className="[display:flex] [flex-wrap:wrap] [align-items:center] [gap:10px]">
                                    <span className="[display:flex] [height:28px] [width:28px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9px] [font-family:Nunito,sans-serif] [font-size:12px] [font-weight:900] [color:#fff] [background:#D70808]">
                                        07
                                    </span>
                                    <span className="[font-size:11px] [font-weight:900] [letter-spacing:0.08em] [color:#9ca3af] [text-transform:uppercase]">
                                        Dashboard Progress
                                    </span>
                                    <span className="[display:inline-flex] [align-items:baseline] [gap:5px] [border-radius:9999px] [padding:6px_13px] [font-family:Nunito,sans-serif] [font-size:15px] [font-weight:900] [white-space:nowrap] [color:#D70808] [background:#FFF0F0] [border:1.5px_solid_#ffb3b3]">
                                        <span className="[font-size:10px] [font-weight:900] [letter-spacing:0.06em] [color:#c96b6b] [text-transform:uppercase]">
                                            Senilai
                                        </span>
                                        Rp 85.000
                                    </span>
                                </div>
                                <h3 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:clamp(19px,2.2vw,22px)] [line-height:1.3] [font-weight:900] [color:#151515]">
                                    Progresmu Terlihat, Bukan Cuma Terasa Sibuk
                                </h3>
                                <p className="[margin:0] [font-size:15px] [line-height:1.7] [color:#3d3d3d]">
                                    Soal dikerjakan, akurasi, waktu belajar,
                                    streak harian, hingga tren skor per section
                                    terekam otomatis, jadi progresmu selalu
                                    terlihat jelas.
                                </p>
                                <div className="[margin-top:2px] [display:flex] [flex-wrap:wrap] [gap:7px]">
                                    <span className="[display:inline-flex] [flex-shrink:0] [align-items:center] [gap:6px] [border-radius:9999px] [padding:6px_12px] [font-size:13px] [font-weight:700] [white-space:nowrap] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec]">
                                        <span className="[font-weight:900] [color:#D70808]">
                                            ✓
                                        </span>
                                        Akurasi &amp; streak harian
                                    </span>

                                    <span className="[display:inline-flex] [flex-shrink:0] [align-items:center] [gap:6px] [border-radius:9999px] [padding:6px_12px] [font-size:13px] [font-weight:700] [white-space:nowrap] [color:#151515] [background:#F7F7F7] [border:1px_solid_#ececec]">
                                        <span className="[font-weight:900] [color:#D70808]">
                                            ✓
                                        </span>
                                        Tren skor per section
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="[margin:0_auto_44px] [max-width:560px] [border-radius:22px] [padding:26px_24px] [text-align:center] [box-shadow:0_4px_22px_rgba(0,0,0,0.06)] [background:#fff] [border:1.5px_solid_#ffd6d6]">
                        <p className="[margin:0_0_8px] [font-size:12px] [font-weight:900] [letter-spacing:0.08em] [color:#9ca3af] [text-transform:uppercase]">
                            Total nilai semua fitur di atas
                        </p>
                        <p className="[margin:0_0_12px] [font-family:Nunito,sans-serif] [font-size:clamp(30px,5vw,40px)] [line-height:1] [font-weight:900] [color:#9ca3af] [text-decoration-color:#D70808] [text-decoration-thickness:3px] [text-decoration:line-through]">
                            Rp 1.005.000
                        </p>
                        <p className="[margin:0_0_6px] [font-size:12px] [font-weight:900] [letter-spacing:0.06em] [color:#D70808] [text-transform:uppercase]">
                            MULAI DARI HANYA
                        </p>
                        <p className="[margin:0_0_8px] [font-family:Nunito,sans-serif] [font-size:clamp(32px,5.4vw,44px)] [line-height:1] [font-weight:900] [color:#D70808]">
                            Rp 99.000
                        </p>
                    </div>

                    <div className="[text-align:center]">
                        <p className="[margin:0_0_20px] [margin-right:auto] [margin-left:auto] [max-width:520px] [font-family:Nunito,sans-serif] [font-size:18px] [line-height:1.5] [font-weight:700] [color:#151515]">
                            Semua fitur ini bisa kamu akses{' '}
                            <span className="[color:#D70808]">
                                begitu kamu bergabung
                            </span>
                            .
                        </p>
                        <div className="[display:flex] [flex-wrap:wrap] [justify-content:center] [gap:12px]">
                            <TrackedCTA
                                zone="midpage"
                                action="scroll"
                                label="Gabung Sekarang"
                                href="#pricing"
                                onClick={scrollToPricing}
                                className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:14px_28px] [font-size:16px] [font-weight:700] [color:#fff] [box-shadow:0_4px_20px_rgba(215,8,8,0.35)] [background:#D70808] [text-decoration:none]"
                            >
                                Gabung Sekarang →
                            </TrackedCTA>
                            <a
                                href="#testimonials"
                                className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:14px_28px] [font-size:16px] [font-weight:700] [color:#151515] [border:2px_solid_#D70808] [text-decoration:none]"
                            >
                                Lihat Bukti Alumni →
                            </a>
                        </div>
                        <div className="[margin-top:12px] [display:flex] [flex-wrap:wrap] [align-items:center] [justify-content:center] [gap:8px_12px]">
                            <span className="[display:flex] [align-items:center] [gap:4px] [font-size:12px] [font-weight:600] [color:#6b7280]">
                                ★★★★★
                                <span className="[margin-left:4px]">
                                    4.9/5 Google Review
                                </span>
                            </span>
                            <span className="[font-size:12px] [color:#6b7280]">
                                •
                            </span>
                            <span className="[font-size:12px] [font-weight:600] [color:#6b7280]">
                                45.000+ Alumni Sukses
                            </span>
                            <span className="[font-size:12px] [color:#6b7280]">
                                •
                            </span>
                            <span className="[font-size:12px] [font-weight:600] [color:#6b7280]">
                                🛡 Garansi 100%
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Full Bright */}
            <section
                id="why-full-bright"
                className="[padding:80px_24px] [background:#F3F3F3]"
            >
                <div className="[margin:0_auto] [max-width:1152px]">
                    <div className="[margin-bottom:48px] [text-align:center]">
                        <div className="[margin-bottom:20px] [display:inline-flex] [align-items:center] [gap:8px] [border-radius:9999px] [padding:6px_16px] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [color:#1D4ED8] [text-transform:uppercase] [background:#E8F1FF] [border:1px_solid_#93b4ff]">
                            🏅 Mengapa Full Bright?
                        </div>
                        <h2 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:clamp(24px,3vw,36px)] [font-weight:900] [color:#151515]">
                            Mengapa{' '}
                            <span className="[color:#D70808]">45.000+</span>{' '}
                            Orang Memilih Full Bright?
                        </h2>
                    </div>
                    <div className="[margin:0_auto_40px] [display:grid] [max-width:768px] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] [gap:16px]">
                        <div className="[display:flex] [align-items:flex-start] [gap:16px] [border-radius:16px] [padding:16px] [box-shadow:0_1px_8px_rgba(0,0,0,0.04)] [background:#fff]">
                            <div className="[margin-top:2px] [display:flex] [height:36px] [width:36px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:12px] [color:#fff] [background:#1D4ED8]">
                                📖
                            </div>
                            <div className="[display:flex] [flex-direction:column] [gap:4px]">
                                <p className="[margin:0] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">
                                    Lembaga Resmi ITP &amp; IIEF Jakarta
                                </p>
                                <p className="[margin:0] [font-size:12px] [line-height:1.5] [color:#6b7280]">
                                    Sertifikat terjamin sah dan diakui langsung
                                    sebagai syarat submission beasiswa luar
                                    negeri.
                                </p>
                            </div>
                        </div>

                        <div className="[display:flex] [align-items:flex-start] [gap:16px] [border-radius:16px] [padding:2px_4px] [box-shadow:0_1px_8px_rgba(0,0,0,0.04)] [background:#fff]">
                            <div className="[margin-top:2px] [display:flex] [height:36px] [width:36px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:12px] [color:#fff] [background:#D70808]">
                                📈
                            </div>
                            <div className="[display:flex] [flex-direction:column] [gap:4px]">
                                <p className="[margin:0] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">
                                    Alumni Lulus Beasiswa ke Luar Negeri
                                </p>
                                <p className="[margin:0] [font-size:8px] [line-height:1.5] [color:#6b7280]">
                                    UK, Jerman, Australia: bukti nyata metode
                                    belajar bertahap ini bekerja, bukan sekadar
                                    janji.
                                </p>
                            </div>
                        </div>

                        <div className="[display:flex] [align-items:flex-start] [gap:16px] [border-radius:16px] [padding:16px] [box-shadow:0_1px_8px_rgba(0,0,0,0.04)] [background:#fff]">
                            <div className="[margin-top:2px] [display:flex] [height:36px] [width:36px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:12px] [color:#fff] [background:#D70808]">
                                👥
                            </div>
                            <div className="[display:flex] [flex-direction:column] [gap:4px]">
                                <p className="[margin:0] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">
                                    Pengajar Praktisi Skor 600+
                                </p>
                                <p className="[margin:0] [font-size:12px] [line-height:1.5] [color:#6b7280]">
                                    Belajar dari yang sudah membuktikan sendiri
                                    skornya, bukan yang cuma tahu teori.
                                </p>
                            </div>
                        </div>

                        <div className="[display:flex] [align-items:flex-start] [gap:16px] [border-radius:16px] [padding:16px] [box-shadow:0_1px_8px_rgba(0,0,0,0.04)] [background:#fff]">
                            <div className="[margin-top:2px] [display:flex] [height:36px] [width:36px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:12px] [color:#fff] [background:#D70808]">
                                ⏱
                            </div>
                            <div className="[display:flex] [flex-direction:column] [gap:4px]">
                                <p className="[margin:0] [font-size:14px] [line-height:1.4] [font-weight:700] [color:#151515]">
                                    Cukup 1 Jam Sehari, Mulai dari Sekarang
                                </p>
                                <p className="[margin:0] [text-align:center] [font-size:17px] [line-height:1.5] [color:#6b7280]">
                                    Tidak perlu menunggu waktu luang besar. 1
                                    jam sehari dari sekarang jauh lebih ringan
                                    daripada belajar maraton menjelang deadline.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="[margin:0_auto_36px] [max-width:440px] [overflow:hidden] [border-radius:18px] [box-shadow:0_3px_16px_rgba(0,0,0,0.05)] [background:#fff] [border:1px_solid_#ececec]">
                        <div className="[line-height:0]">
                            <img
                                src="/assets/Foto Bareng.png"
                                alt="Tim instruktur Full Bright Indonesia"
                                className="[display:block] [height:auto] [width:100%]"
                            />
                        </div>
                        <p className="[margin:0] [padding:14px_18px] [text-align:center] [font-family:Nunito,sans-serif] [font-size:13px] [font-weight:800] [color:#151515]">
                            Tim instruktur Full Bright, pengalaman 10+ tahun
                            mengajar TOEFL ITP
                        </p>
                    </div>

                    <div className="[text-align:center]">
                        <div className="[display:flex] [flex-wrap:wrap] [justify-content:center] [gap:12px]">
                            <TrackedCTA
                                zone="midpage"
                                action="scroll"
                                label="Gabung Sekarang"
                                href="#pricing"
                                onClick={scrollToPricing}
                                className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:30px_64px] [font-size:24px] [font-weight:700] [color:#fff] [box-shadow:0_4px_20px_rgba(215,8,8,0.35)] [background:#D70808] [text-decoration:none]"
                            >
                                Gabung Sekarang →
                            </TrackedCTA>
                            <a
                                href="#testimonials"
                                className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:14px_28px] [font-size:16px] [font-weight:700] [color:#151515] [border:2px_solid_#D70808] [text-decoration:none]"
                            >
                                Lihat Bukti Alumni →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section id="testimonials">
                <div className="[padding:40px_24px] [background:#151515]">
                    <div className="[margin:0_auto] [display:grid] [max-width:1152px] [grid-template-columns:repeat(auto-fit,minmax(140px,1fr))] [gap:32px] [text-align:center] [color:#fff]">
                        <div>
                            <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:clamp(32px,4vw,48px)] [font-weight:900] [letter-spacing:-0.02em]">
                                45.000+
                            </p>
                            <p className="[margin:6px_0_0] [font-size:12px] [font-weight:500] [letter-spacing:0.02em] [opacity:0.75]">
                                Alumni Sukses
                            </p>
                        </div>

                        <div>
                            <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:clamp(32px,4vw,48px)] [font-weight:900] [letter-spacing:-0.02em]">
                                4.9/5
                            </p>
                            <p className="[margin:6px_0_0] [font-size:12px] [font-weight:500] [letter-spacing:0.02em] [opacity:0.75]">
                                Rating Rata-rata
                            </p>
                        </div>

                        <div>
                            <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:clamp(32px,4vw,48px)] [font-weight:900] [letter-spacing:-0.02em]">
                                13+
                            </p>
                            <p className="[margin:6px_0_0] [font-size:12px] [font-weight:500] [letter-spacing:0.02em] [opacity:0.75]">
                                Tahun Pengalaman
                            </p>
                        </div>

                        <div>
                            <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:clamp(32px,4vw,48px)] [font-weight:900] [letter-spacing:-0.02em]">
                                95%
                            </p>
                            <p className="[margin:6px_0_0] [font-size:12px] [font-weight:500] [letter-spacing:0.02em] [opacity:0.75]">
                                Skor Naik Signifikan
                            </p>
                        </div>
                    </div>
                </div>
                <div className="[padding:80px_24px] [background:#fff]">
                    <div className="[margin:0_auto] [max-width:1152px]">
                        <div className="[margin-bottom:48px] [text-align:center]">
                            <div className="[margin-bottom:20px] [display:inline-flex] [align-items:center] [gap:8px] [border-radius:9999px] [padding:6px_16px] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [color:#D70808] [text-transform:uppercase] [background:#FFF0F0] [border:1px_solid_#ffb3b3]">
                                💬 Testimoni Alumni Kami
                            </div>
                            <h2 className="[margin:0_0_16px] [font-family:Nunito,sans-serif] [font-size:clamp(24px,3vw,36px)] [font-weight:900] [color:#151515]">
                                Lihat Bagaimana Strategi Kami Membantu Alumni
                                <br />
                                <span className="[color:rgb(215,_8,_8)]">
                                    Meraih Target Skor Untuk Beasiswa &amp; CPNS
                                </span>
                            </h2>
                            <p className="[margin:0] [font-size:14px] [color:#9ca3af]">
                                Klik foto untuk memperbesar
                            </p>
                        </div>

                        <div className="[margin-bottom:56px] [overflow:hidden] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
                            <div className="[display:flex] [width:max-content] [animation:infiniteScroll_35s_linear_infinite]">
                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            547
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl1.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>

                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            543
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl2.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>

                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            563
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl3.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>

                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            560
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl4.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>

                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            507
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl5.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>

                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            513
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl6.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>

                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            537
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl7.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>

                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            560
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl9.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>

                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            547
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl1.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>

                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            543
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl2.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>

                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            563
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl3.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>

                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            560
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl4.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>

                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            507
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl5.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>

                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            513
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl6.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>

                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            537
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl7.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>

                                <div className="[margin:0_8px] [display:flex] [flex-shrink:0] [flex-direction:column] [align-items:center] [gap:8px]">
                                    <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:16px] [font-weight:800] [color:#151515]">
                                        Skor{' '}
                                        <span className="[color:#D70808]">
                                            560
                                        </span>
                                    </p>
                                    <div className="[aspect-ratio:9/16] [width:130px] [overflow:hidden] [border-radius:12px] [background-image:url(/assets/toefl9.webp)] [background-size:cover] [background-position:center] [box-shadow:0_4px_16px_rgba(0,0,0,0.15)]"></div>
                                </div>
                            </div>
                        </div>

                        <div className="[margin:0_auto_56px] [width:100%] [max-width:896px]">
                            <p className="[margin:0_0_24px] [text-align:center] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [color:#9ca3af] [text-transform:uppercase]">
                                Testimoni Alumni yang Sukses Masuk Universitas
                                Luar Negeri
                            </p>
                            <div className="[display:grid] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))] [gap:16px]">
                                <div className="[display:flex] [min-width:0] [flex-direction:column] [gap:12px] [border-radius:16px] [padding:20px] [box-shadow:0_2px_16px_rgba(0,0,0,0.05)] [background:#F9F9F9] [border:1px_solid_#f3f4f6]">
                                    <span className="[align-self:flex-start] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [color:#D70808] [background:#FFF0F0]">
                                        University of Nottingham, UK
                                    </span>
                                    <p className="[margin:0] [font-size:12px] [font-weight:900] [letter-spacing:0.08em] [color:#D70808] [text-transform:uppercase]">
                                        Sangat Terjangkau Untuk Mahasiswa
                                    </p>
                                    <p className="[margin:0] [flex:1] [font-size:14px] [line-height:1.6] [color:#3d3d3d]">
                                        "Full Bright ini tempat yang paling
                                        "pas" buat teman-teman Mahasiswa
                                        menaklukkan Tes TOEFL &amp; IELTS"
                                    </p>
                                    <div className="[display:flex] [align-items:center] [gap:12px] [padding-top:8px] [border-top:1px_solid_#f3f4f6]">
                                        <div
                                            role="img"
                                            aria-label="Andi Manggala Putra"
                                            className="[height:40px] [width:40px] [flex-shrink:0] [border-radius:9999px] [background-image:url(/assets/People%201.webp)] [background-size:cover] [background-position:center]"
                                        ></div>
                                        <div className="[min-width:0] [flex:1]">
                                            <p className="[margin:0] [overflow:hidden] [font-family:Nunito,sans-serif] [font-size:14px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                                Andi Manggala Putra
                                            </p>
                                            <p className="[margin:0] [overflow:hidden] [font-size:12px] [text-overflow:ellipsis] [white-space:nowrap] [color:#6b7280]">
                                                Accounting and Finance
                                            </p>
                                        </div>
                                        <span className="[flex-shrink:0] [font-size:12px] [color:#F59E0B]">
                                            ★★★★★
                                        </span>
                                    </div>
                                </div>

                                <div className="[display:flex] [min-width:0] [flex-direction:column] [gap:12px] [border-radius:16px] [padding:20px] [box-shadow:0_2px_16px_rgba(0,0,0,0.05)] [background:#F9F9F9] [border:1px_solid_#f3f4f6]">
                                    <span className="[align-self:flex-start] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [color:#D70808] [background:#FFF0F0]">
                                        Stuttgart University, Germany
                                    </span>
                                    <p className="[margin:0] [font-size:12px] [font-weight:900] [letter-spacing:0.08em] [color:#D70808] [text-transform:uppercase]">
                                        A Good Place to Learn TOEFL &amp; IELTS
                                    </p>
                                    <p className="[margin:0] [flex:1] [font-size:14px] [line-height:1.6] [color:#3d3d3d]">
                                        "Fullbright growing together with their
                                        students. This place is good place to
                                        learn TOEFL &amp; IELTS. Thank you for
                                        the teacher and friendly staff. Now I
                                        can see the world"
                                    </p>
                                    <div className="[display:flex] [align-items:center] [gap:12px] [padding-top:8px] [border-top:1px_solid_#f3f4f6]">
                                        <div
                                            role="img"
                                            aria-label="Hajrah"
                                            className="[height:40px] [width:40px] [flex-shrink:0] [border-radius:9999px] [background-image:url(/assets/People%202.webp)] [background-size:cover] [background-position:center]"
                                        ></div>
                                        <div className="[min-width:0] [flex:1]">
                                            <p className="[margin:0] [overflow:hidden] [font-family:Nunito,sans-serif] [font-size:14px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                                Hajrah
                                            </p>
                                            <p className="[margin:0] [overflow:hidden] [font-size:12px] [text-overflow:ellipsis] [white-space:nowrap] [color:#6b7280]">
                                                Student Water Resources
                                                Engineering and Management
                                            </p>
                                        </div>
                                        <span className="[flex-shrink:0] [font-size:12px] [color:#F59E0B]">
                                            ★★★★★
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="[margin-top:40px] [overflow:hidden] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                            <div className="[display:flex] [width:max-content] [animation:infiniteScroll_40s_linear_infinite]">
                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjU5AMTzLrJktkSAtgPl67tp9gcrVdfNprQkFE3OTlWsG2HLAYKC=w108-h108-p-rp-mo-br100"
                                        alt="Kak Rani"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Rani
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        547
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjUIlyFVfg_CALswxLovEgu-9KN1G8qj5gZtWp7wBgK0kZTCUDQ=w108-h108-p-rp-mo-br100"
                                        alt="Kak Ayu"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Ayu
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        543
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjV5Szg5YHC8wz4qGbdkyShVXvqJJmsdU-7k86b01QvrG9eS3bQv=w108-h108-p-rp-mo-br100"
                                        alt="Mbak Widya"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Mbak Widya
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        563
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjXRbjwvAkh5Knchil81RMVI9JoXdsQWp9wX1k-eB1LIfnpZ7hY=w108-h108-p-rp-mo-br100"
                                        alt="Pak Yohanes"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Pak Yohanes
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        560
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjU3DvvpNvLJTv0Uu_Se4Ke4KXRZ7xS2wTByWCN2Yo1LNbBCxa0=w108-h108-p-rp-mo-br100"
                                        alt="Kak Uly Sinaga"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Uly Sinaga
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        507
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjWbvvA2Wwy2D6SF141W1iTa3Hd3QeOJqaWOfjyv1J_ObcaJtKY=w108-h108-p-rp-mo-br100"
                                        alt="Kak Nadia Ayu"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Nadia Ayu
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        513
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjU5AMTzLrJktkSAtgPl67tp9gcrVdfNprQkFE3OTlWsG2HLAYKC=w108-h108-p-rp-mo-br100"
                                        alt="Kak Rani"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Rani
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        547
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjUIlyFVfg_CALswxLovEgu-9KN1G8qj5gZtWp7wBgK0kZTCUDQ=w108-h108-p-rp-mo-br100"
                                        alt="Kak Ayu"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Ayu
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        543
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjV5Szg5YHC8wz4qGbdkyShVXvqJJmsdU-7k86b01QvrG9eS3bQv=w108-h108-p-rp-mo-br100"
                                        alt="Mbak Widya"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Mbak Widya
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        563
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjXRbjwvAkh5Knchil81RMVI9JoXdsQWp9wX1k-eB1LIfnpZ7hY=w108-h108-p-rp-mo-br100"
                                        alt="Pak Yohanes"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Pak Yohanes
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        560
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjU3DvvpNvLJTv0Uu_Se4Ke4KXRZ7xS2wTByWCN2Yo1LNbBCxa0=w108-h108-p-rp-mo-br100"
                                        alt="Kak Uly Sinaga"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Uly Sinaga
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        507
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjWbvvA2Wwy2D6SF141W1iTa3Hd3QeOJqaWOfjyv1J_ObcaJtKY=w108-h108-p-rp-mo-br100"
                                        alt="Kak Nadia Ayu"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Nadia Ayu
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        513
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjU5AMTzLrJktkSAtgPl67tp9gcrVdfNprQkFE3OTlWsG2HLAYKC=w108-h108-p-rp-mo-br100"
                                        alt="Kak Rani"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Rani
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        547
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjUIlyFVfg_CALswxLovEgu-9KN1G8qj5gZtWp7wBgK0kZTCUDQ=w108-h108-p-rp-mo-br100"
                                        alt="Kak Ayu"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Ayu
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        543
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjV5Szg5YHC8wz4qGbdkyShVXvqJJmsdU-7k86b01QvrG9eS3bQv=w108-h108-p-rp-mo-br100"
                                        alt="Mbak Widya"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Mbak Widya
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        563
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjXRbjwvAkh5Knchil81RMVI9JoXdsQWp9wX1k-eB1LIfnpZ7hY=w108-h108-p-rp-mo-br100"
                                        alt="Pak Yohanes"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Pak Yohanes
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        560
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjU3DvvpNvLJTv0Uu_Se4Ke4KXRZ7xS2wTByWCN2Yo1LNbBCxa0=w108-h108-p-rp-mo-br100"
                                        alt="Kak Uly Sinaga"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Uly Sinaga
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        507
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjWbvvA2Wwy2D6SF141W1iTa3Hd3QeOJqaWOfjyv1J_ObcaJtKY=w108-h108-p-rp-mo-br100"
                                        alt="Kak Nadia Ayu"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Nadia Ayu
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        513
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjU5AMTzLrJktkSAtgPl67tp9gcrVdfNprQkFE3OTlWsG2HLAYKC=w108-h108-p-rp-mo-br100"
                                        alt="Kak Rani"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Rani
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        547
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjUIlyFVfg_CALswxLovEgu-9KN1G8qj5gZtWp7wBgK0kZTCUDQ=w108-h108-p-rp-mo-br100"
                                        alt="Kak Ayu"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Ayu
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        543
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjV5Szg5YHC8wz4qGbdkyShVXvqJJmsdU-7k86b01QvrG9eS3bQv=w108-h108-p-rp-mo-br100"
                                        alt="Mbak Widya"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Mbak Widya
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        563
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjXRbjwvAkh5Knchil81RMVI9JoXdsQWp9wX1k-eB1LIfnpZ7hY=w108-h108-p-rp-mo-br100"
                                        alt="Pak Yohanes"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Pak Yohanes
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        560
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjU3DvvpNvLJTv0Uu_Se4Ke4KXRZ7xS2wTByWCN2Yo1LNbBCxa0=w108-h108-p-rp-mo-br100"
                                        alt="Kak Uly Sinaga"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Uly Sinaga
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        507
                                    </p>
                                </div>

                                <div className="[margin:0_12px] [display:flex] [width:220px] [flex-shrink:0] [align-items:center] [gap:12px] [border-radius:16px] [padding:16px_20px] [box-shadow:0_2px_12px_rgba(0,0,0,0.06)] [background:#fff] [border:1px_solid_#f3f4f6]">
                                    <img
                                        src="https://lh3.googleusercontent.com/a-/ALV-UjWbvvA2Wwy2D6SF141W1iTa3Hd3QeOJqaWOfjyv1J_ObcaJtKY=w108-h108-p-rp-mo-br100"
                                        alt="Kak Nadia Ayu"
                                        className="[height:36px] [width:36px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover]"
                                    />
                                    <div className="[min-width:0] [flex:1]">
                                        <p className="[margin:0] [overflow:hidden] [font-size:12px] [font-weight:900] [text-overflow:ellipsis] [white-space:nowrap] [color:#151515]">
                                            Kak Nadia Ayu
                                        </p>
                                    </div>
                                    <p className="[margin:0] [flex-shrink:0] [font-family:Nunito,sans-serif] [font-size:20px] [font-weight:900] [color:#16a34a]">
                                        513
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="[margin-top:48px]">
                            <div className="[margin-bottom:24px] [display:flex] [align-items:center] [justify-content:center] [gap:8px]">
                                <svg width="20" height="20" viewBox="0 0 48 48">
                                    <path
                                        fill="#FFC107"
                                        d="M43.6 20.5H42V20.4H24v7.2h11.3C33.7 32 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.9 6.1 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                                    ></path>
                                    <path
                                        fill="#FF3D00"
                                        d="M6.3 14.7l5.8 4.3C13.9 15.4 18.6 12 24 12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.9 6.1 29.2 4 24 4 16.4 4 9.8 8.5 6.3 14.7z"
                                    ></path>
                                    <path
                                        fill="#4CAF50"
                                        d="M24 44c5.2 0 9.9-2 13.4-5.3l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.3 0-9.6-3.4-11.3-8l-6 4.6C9.6 39.5 16.2 44 24 44z"
                                    ></path>
                                    <path
                                        fill="#1976D2"
                                        d="M43.6 20.5H42V20.4H24v7.2h11.3c-1 3-3.1 5.5-5.9 7.1l6.2 5.2C39.4 37 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"
                                    ></path>
                                </svg>
                                <span className="[font-size:14px] [font-weight:800] [color:#151515]">
                                    4.9
                                </span>
                                <span className="[font-size:16px] [color:#FBBF24]">
                                    ★★★★★
                                </span>
                                <span className="[font-size:14px] [font-weight:400] [color:#6b7280]">
                                    <b>3.620</b> Google Reviews
                                </span>
                            </div>
                            <div className="[position:relative] [display:flex] [height:220px] [align-items:center] [justify-content:center] [overflow:hidden]">
                                <button
                                    onClick={prevGoogle}
                                    aria-label="Sebelumnya"
                                    className="[position:absolute] [left:0] [z-index:3] [display:flex] [height:36px] [width:36px] [cursor:pointer] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:16px] [color:#151515] [box-shadow:0_4px_12px_rgba(0,0,0,0.12)] [background:#fff] [border:1px_solid_#e5e7eb]"
                                >
                                    ‹
                                </button>
                                <div
                                    style={css(gSideStyle('prev', gIdx))}
                                    onClick={() =>
                                        setReviewIdx(
                                            (gIdx - 1 + REVIEW_COUNT) %
                                                REVIEW_COUNT,
                                        )
                                    }
                                ></div>
                                <img
                                    src={reviewSrc(gIdx)}
                                    alt={`Review alumni ${(gIdx % REVIEW_COUNT) + 1}`}
                                    onClick={() => setReviewIdx(gIdx)}
                                    className="[position:absolute] [left:50%] [z-index:2] [height:210px] [width:auto] [max-width:340px] [transform:translateX(-50%)] [cursor:pointer] [border-radius:16px] [object-fit:contain] [box-shadow:0_8px_28px_rgba(0,0,0,0.18)] [transition:all_0.3s_ease]"
                                />
                                <div
                                    style={css(gSideStyle('next', gIdx))}
                                    onClick={() =>
                                        setReviewIdx((gIdx + 1) % REVIEW_COUNT)
                                    }
                                ></div>
                                <button
                                    onClick={nextGoogle}
                                    aria-label="Selanjutnya"
                                    className="[position:absolute] [right:0] [z-index:3] [display:flex] [height:36px] [width:36px] [cursor:pointer] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:16px] [color:#151515] [box-shadow:0_4px_12px_rgba(0,0,0,0.12)] [background:#fff] [border:1px_solid_#e5e7eb]"
                                >
                                    ›
                                </button>
                            </div>
                        </div>

                        <div className="[margin-top:48px] [margin-right:auto] [margin-left:auto] [max-width:520px]">
                            <p className="[margin:0_0_6px] [text-align:center] [font-size:11px] [font-weight:900] [letter-spacing:0.08em] [color:#9ca3af] [text-transform:uppercase]">
                                Cerita Alumni
                            </p>
                            <h3 className="[margin:0_0_16px] [text-align:center] [font-family:Nunito,sans-serif] [font-size:clamp(19px,2.4vw,24px)] [line-height:1.3] [font-weight:900] [color:#151515]">
                                Dengar Langsung dari{' '}
                                <span className="[color:#D70808]">
                                    Alumni Kami
                                </span>
                            </h3>
                            <div
                                className="[position:relative] [cursor:pointer] [overflow:hidden] [border-radius:18px] [line-height:0] [box-shadow:0_8px_28px_rgba(0,0,0,0.18)] [background:#151515]"
                                onClick={playVideo}
                            >
                                <video
                                    ref={videoRef}
                                    src="/assets/testimoni iyha.mp4#t=1.5"
                                    controls
                                    playsInline
                                    preload="metadata"
                                    onPlay={() => setShowOverlay(false)}
                                    className="[display:block] [aspect-ratio:9/16] [max-height:560px] [width:100%] [object-fit:cover] [background:#151515]"
                                ></video>
                                {showOverlay ? (
                                    <>
                                        <div className="[position:absolute] [inset:0] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [gap:14px] [background:rgba(21,21,21,0.35)]">
                                            <span className="[display:flex] [height:76px] [width:76px] [align-items:center] [justify-content:center] [border-radius:9999px] [box-shadow:0_8px_28px_rgba(215,8,8,0.5)] [background:#D70808]">
                                                <svg
                                                    width="30"
                                                    height="30"
                                                    viewBox="0 0 24 24"
                                                    fill="#fff"
                                                >
                                                    <path d="M8 5.5v13l11-6.5z"></path>
                                                </svg>
                                            </span>
                                            <span className="[font-family:Nunito,sans-serif] [font-size:13px] [font-weight:800] [color:#fff] [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">
                                                Putar video testimoni
                                            </span>
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </div>

                        <div className="[margin-top:40px] [text-align:center]">
                            <p className="[margin:0_0_20px] [margin-right:auto] [margin-left:auto] [max-width:520px] [font-family:Nunito,sans-serif] [font-size:18px] [line-height:1.5] [font-weight:700] [color:#151515]">
                                Keberhasilan alumni selama ini bukan karena
                                mereka pintar, tapi karena mereka{' '}
                                <span className="[color:#D70808]">
                                    gunakan metode yang tepat
                                </span>
                                .
                            </p>
                            <TrackedCTA
                                zone="midpage"
                                action="scroll"
                                label="Gabung Sekarang"
                                href="#pricing"
                                onClick={scrollToPricing}
                                className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:14px_28px] [font-size:16px] [font-weight:700] [color:#fff] [box-shadow:0_4px_20px_rgba(215,8,8,0.35)] [background:#D70808] [text-decoration:none]"
                            >
                                Gabung Sekarang →
                            </TrackedCTA>
                        </div>
                    </div>
                </div>
            </section>

            {/* Photo Lightbox */}
            {lightboxIdx !== null ? (
                <>
                    <div
                        className="[position:fixed] [inset:0] [z-index:50] [display:flex] [align-items:center] [justify-content:center] [background:rgba(0,0,0,0.92)]"
                        onClick={closeLightbox}
                    >
                        <button
                            onClick={closeLightbox}
                            className="[position:absolute] [top:16px] [right:16px] [cursor:pointer] [font-size:28px] [color:rgba(255,255,255,0.7)] [background:none] [border:none]"
                        >
                            ✕
                        </button>
                        <button
                            onClick={prevPhoto}
                            className="[position:absolute] [left:16px] [cursor:pointer] [padding:8px] [font-size:36px] [color:rgba(255,255,255,0.7)] [background:none] [border:none]"
                        >
                            ‹
                        </button>
                        <div
                            className="[display:flex] [flex-direction:column] [align-items:center] [gap:16px] [padding:0_64px]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                role="img"
                                aria-label="Score"
                                style={css(lbImgStyle(lightboxIdx))}
                            ></div>
                            <p className="[margin:0] [font-size:14px] [color:rgba(255,255,255,0.6)]">
                                Skor {WA_SCREENSHOTS[lightboxIdx ?? 0].score}
                            </p>
                            <p className="[margin:0] [font-size:12px] [color:rgba(255,255,255,0.4)]">
                                {(lightboxIdx ?? 0) + 1} /{' '}
                                {WA_SCREENSHOTS.length}
                            </p>
                        </div>
                        <button
                            onClick={nextPhoto}
                            className="[position:absolute] [right:16px] [cursor:pointer] [padding:8px] [font-size:36px] [color:rgba(255,255,255,0.7)] [background:none] [border:none]"
                        >
                            ›
                        </button>
                    </div>
                </>
            ) : null}

            {/* Review Lightbox */}
            {reviewIdx !== null ? (
                <>
                    <div
                        className="[position:fixed] [inset:0] [z-index:50] [display:flex] [align-items:center] [justify-content:center] [background:rgba(0,0,0,0.92)]"
                        onClick={closeReview}
                    >
                        <button
                            onClick={closeReview}
                            className="[position:absolute] [top:16px] [right:16px] [cursor:pointer] [font-size:28px] [color:rgba(255,255,255,0.7)] [background:none] [border:none]"
                        >
                            ✕
                        </button>
                        <button
                            onClick={prevReview}
                            className="[position:absolute] [left:16px] [cursor:pointer] [padding:8px] [font-size:36px] [color:rgba(255,255,255,0.7)] [background:none] [border:none]"
                        >
                            ‹
                        </button>
                        <div
                            className="[display:flex] [flex-direction:column] [align-items:center] [gap:16px] [padding:0_64px]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                role="img"
                                aria-label="Review"
                                style={css(rvImgStyle(reviewIdx))}
                            ></div>
                            <p className="[margin:0] [font-size:12px] [color:rgba(255,255,255,0.4)]">
                                {(reviewIdx ?? 0) + 1} / {REVIEW_COUNT}
                            </p>
                        </div>
                        <button
                            onClick={nextReview}
                            className="[position:absolute] [right:16px] [cursor:pointer] [padding:8px] [font-size:36px] [color:rgba(255,255,255,0.7)] [background:none] [border:none]"
                        >
                            ›
                        </button>
                    </div>
                </>
            ) : null}

            {/* Pricing: Belajar Sendiri (self-study mode) */}
            {mode === 'self' ? (
                <>
                    <section
                        id="pricing"
                        className="[padding:80px_24px_48px] [background:#fff]"
                    >
                        <div className="[margin:0_auto] [max-width:1152px]">
                            <div className="[margin-bottom:32px] [text-align:center]">
                                <div className="[margin-bottom:20px] [display:inline-flex] [align-items:center] [gap:8px] [border-radius:9999px] [padding:6px_16px] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [color:#D70808] [text-transform:uppercase] [background:#FFF0F0] [border:1px_solid_#ffb3b3]">
                                    ⏳ Mulai dari Sekarang, Bukan Nanti
                                </div>
                                <h2 className="[margin:0_0_20px] [font-family:Nunito,sans-serif] [font-size:clamp(24px,3vw,36px)] [font-weight:900] [color:#151515]">
                                    Persiapkan Sekarang,{' '}
                                    <span className="[color:rgb(215,_8,_8)]">
                                        Jangan Ditunda
                                    </span>
                                </h2>
                                <p className="[margin:0] [margin-right:auto] [margin-left:auto] [max-width:512px] [font-size:10px] [line-height:1.6] [color:#3d3d3d]">
                                    <b>
                                        Semakin cepat kamu mulai, semakin besar
                                        peluang kamu diterima beasiswa
                                    </b>{' '}
                                    karena skor 500+ tercapai sebelum deadline
                                    submission.
                                </p>
                            </div>

                            <div className="[margin-bottom:44px] [text-align:center]">
                                <p className="[margin:0_0_6px] [font-size:13px] [font-weight:800] [letter-spacing:0.08em] [color:#D70808] [text-transform:uppercase]">
                                    👇 Pilih Cara Belajarmu
                                </p>

                                <div className="[display:flex] [flex-wrap:wrap] [justify-content:center] [gap:4px] [border-radius:9999px] [padding:5px] [max-width:340px] [margin:0_auto] [box-shadow:0_2px_12px_rgba(215,8,8,0.08)] [background:#fff] [border:1px_solid_#ffb3b3]">
                                    <button
                                        onClick={() => setMode('self')}
                                        style={css(toggleBtnStyle(true))}
                                    >
                                        Belajar Sendiri
                                    </button>
                                    <button
                                        onClick={() => setMode('tutor')}
                                        className="[position:relative]"
                                        style={css(toggleBtnStyle(false))}
                                    >
                                        Dibimbing Tutor
                                        <span className="[position:absolute] [top:-9px] [right:-6px] [display:flex] [height:28px] [width:28px] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:10px] [font-weight:900] [color:#fff] [box-shadow:0_2px_8px_rgba(249,115,22,0.4)] [background:#F97316] [border:2px_solid_fff] max-[639px]:[height:24px] max-[639px]:[width:24px] max-[639px]:[font-size:9px] max-[639px]:[right:-4px] max-[639px]:[top:-7px]">
                                            -80%
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="[margin:0_auto_40px] [max-width:520px]">
                                <div className="[position:relative] [display:flex] [flex-direction:column] [overflow:hidden] [border-radius:24px] [padding:28px] [box-shadow:0_8px_32px_rgba(245,183,0,0.15)] [background:linear-gradient(165deg,#ffffff_0%,#fffbf0_100%)] [border:2px_solid_#F5B700]">
                                    <div className="[position:absolute] [top:0] [right:0] [border-bottom-left-radius:16px] [padding:8px_16px] [font-family:Nunito,sans-serif] [font-size:12px] [font-weight:900] [color:#FFFFFF] [background:#F5B700]">
                                        🔥 POPULAR
                                    </div>
                                    <div className="[margin-top:20px] [margin-bottom:4px] [display:flex] [align-items:flex-start] [justify-content:space-between]">
                                        <div>
                                            <p className="[margin:0_0_4px] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [color:#9ca3af] [text-transform:uppercase]">
                                                E-Course
                                            </p>
                                            <h3 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:24px] [font-weight:900] [color:#151515]">
                                                Self-Study LMS
                                            </h3>
                                        </div>
                                        <span className="[display:flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [color:#D70808] [background:#FFF0F0]">
                                            📚 Mandiri
                                        </span>
                                    </div>
                                    <p className="[margin:0_0_16px] [font-size:15px] [font-weight:700] [color:#4b5563]">
                                        Target Skor:{' '}
                                        <span className="[font-size:20px] [font-weight:900] [color:#16a34a]">
                                            500+
                                        </span>{' '}
                                        ·{' '}
                                        <span className="[font-weight:900] [color:#151515]">
                                            Belajar Kapan Saja
                                        </span>
                                    </p>
                                    <div className="[margin-bottom:20px] [border-radius:16px] [padding:16px] [background:#FFF0F0] [border:1.5px_solid_#ffb3b3]">
                                        <div className="[margin-bottom:4px] [display:flex] [align-items:center] [gap:8px]">
                                            <span className="[font-size:14px] [font-weight:600] [color:#9ca3af] [text-decoration:line-through]">
                                                Rp 250.000
                                            </span>
                                            <span className="[border-radius:9999px] [padding:2px_8px] [font-size:12px] [font-weight:900] [color:#fff] [background:#D70808]">
                                                HEMAT 60%
                                            </span>
                                        </div>
                                        <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:30px] [font-weight:900] [color:#D70808]">
                                            Rp 99.000
                                        </p>
                                    </div>
                                    <ul className="[margin:0_0_8px] [display:flex] [flex:1] [flex-direction:column] [gap:8px] [padding:0] [list-style:none]">
                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:800] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            60+ Video Materi Pembelajaran
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:800] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Materi Hari ke-1 s/d ke-15 (Roadmap
                                            Lengkap)
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:800] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Lebih dari 1.000+ Nomor Latihan Soal
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Grup WA Diskusi
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Diagnostic Test
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Simulasi dan Post Test (Full Skills)
                                        </li>
                                    </ul>
                                    <p className="[margin:12px_0_8px] [font-size:12px] [font-weight:700] [letter-spacing:0.06em] [color:#9ca3af] [text-transform:uppercase]">
                                        Belum termasuk:
                                    </p>
                                    <ul className="[margin:0_0_20px] [display:flex] [flex-direction:column] [gap:8px] [padding:0] [list-style:none]">
                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [color:#9ca3af]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#d1d5db]">
                                                ✕
                                            </span>
                                            LIVE ZOOM 15 Hari
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [color:#9ca3af]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#d1d5db]">
                                                ✕
                                            </span>
                                            Sertifikat TOEFL
                                        </li>
                                    </ul>
                                    <div className="[display:flex] [flex-direction:column] [gap:6px]">
                                        <TrackedCTA
                                            zone="pricing"
                                            action="external_checkout"
                                            label="Mulai Belajar Mandiri"
                                            href="https://member.fullbrightindonesia.com/paket-gold-e-course-toefl"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={markCheckoutClicked}
                                            className="[box-sizing:border-box] [display:inline-flex] [width:100%] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:16px_20px] [font-size:16px] [font-weight:900] [color:#fff] [box-shadow:0_6px_24px_rgba(215,8,8,0.4)] [background:#D70808] [text-decoration:none]"
                                            style={{ color: '#fff', background: '#D70808' }}
                                        >
                                            Mulai Belajar Mandiri →
                                        </TrackedCTA>
                                        <p className="[margin:0] [display:flex] [align-items:center] [justify-content:center] [gap:4px] [text-align:center] [font-size:12px] [color:#9ca3af]">
                                            🔒 Pembayaran aman &amp; terenkripsi
                                        </p>
                                    </div>
                                    <div className="[margin:12px_0] [display:flex] [align-items:center] [gap:12px]">
                                        <div className="[height:1px] [flex:1] [background:#e5e7eb]"></div>
                                        <span className="[font-size:12px] [font-weight:600] [color:#9ca3af]">
                                            atau
                                        </span>
                                        <div className="[height:1px] [flex:1] [background:#e5e7eb]"></div>
                                    </div>
                                    <TrackedCTA
                                        zone="pricing"
                                        action="whatsapp"
                                        label="Tanya E-Course via WhatsApp"
                                        href="https://wa.me/6285255499299?text=Halo%20Admin%20Full%20Bright%20Indonesia.%20Saya%20minat%20mau%20daftar%20E-Course%20Self-Study%20LMS."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="[box-sizing:border-box] [display:inline-flex] [width:100%] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:12px_20px] [font-size:14px] [font-weight:700] [color:#16a34a] [background:transparent] [border:1.5px_solid_#25D366] [text-decoration:none]"
                                    >
                                        <img
                                            src="/assets/admin-avatar.jpg"
                                            alt="Admin Full Bright"
                                            className="[height:26px] [width:26px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover] [border:2px_solid_#25D366]"
                                        />
                                        💬 Tanya via WhatsApp
                                    </TrackedCTA>
                                    <p className="[margin:14px_0_0] [text-align:center] [font-size:13px] [line-height:1.5] [color:#9ca3af]">
                                        Mau intip materinya dulu?{' '}
                                        <a
                                            href="https://class.fullbrightindonesia.com/register"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="[font-weight:800] [color:#6b7280] [text-underline-offset:3px] [text-decoration:underline]"
                                        >
                                            Coba gratis 1 modul di LMS
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="[margin:0_auto_32px] [max-width:520px]">
                                <p className="[margin:0_0_16px] [text-align:center] [font-size:13px] [font-weight:800] [letter-spacing:0.06em] [color:#9a9a9a] [text-transform:uppercase]">
                                    Kata Mereka yang Belajar Mandiri
                                </p>
                                <div className="[display:grid] [grid-template-columns:1fr] [gap:12px]">
                                    <div className="[border-radius:16px] [padding:22px] [background:#F9F9F9] [border:1px_solid_#ececec]">
                                        <p className="[margin:0_0_8px] [font-size:16px] [letter-spacing:0.08em] [color:#FBBF24]">
                                            ★★★★★
                                        </p>
                                        <p className="[margin:0_0_18px] [font-size:15px] [line-height:1.7] [color:#3d3d3d]">
                                            "Trm kasih Full Bright Indonesia yg
                                            sudah memberikan kesempatan belajar
                                            Bhs Inggris, belajar di sini bisa
                                            menjadi alternatif bagi individu yg
                                            ingin belajar sambil bekerja, LMS
                                            bisa diakses kapan pun"
                                        </p>
                                        <div className="[display:flex] [align-items:center] [gap:14px]">
                                            <img
                                                src="/assets/nina.png"
                                                alt="Nina Hernawati"
                                                className="[height:60px] [width:60px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover] [box-shadow:0_3px_12px_rgba(0,0,0,0.12)] [border:2px_solid_#fff]"
                                            />
                                            <div>
                                                <p className="[margin:0_0_2px] [font-family:Nunito,sans-serif] [font-size:17px] [font-weight:900] [color:#151515]">
                                                    Nina Hernawati
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            ) : null}

            {/* Pricing: Dibimbing Tutor (default mode) */}
            {mode === 'tutor' ? (
                <>
                    <section
                        id="pricing-tutor"
                        className="[padding:80px_24px_48px] [background:#fff]"
                    >
                        <div className="[margin:0_auto] [max-width:1152px]">
                            <div className="[margin-bottom:32px] [text-align:center]">
                                <div className="[margin-bottom:20px] [display:inline-flex] [align-items:center] [gap:8px] [border-radius:9999px] [padding:6px_16px] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [color:#D70808] [text-transform:uppercase] [background:#FFF0F0] [border:1px_solid_#ffb3b3]">
                                    ⏳ Mulai dari Sekarang, Bukan Nanti
                                </div>
                                <h2 className="[margin:0_0_20px] [font-family:Nunito,sans-serif] [font-size:clamp(24px,3vw,36px)] [font-weight:900] [color:#151515]">
                                    Persiapkan Sekarang,{' '}
                                    <span className="[color:rgb(215,_8,_8)]">
                                        Jangan Ditunda
                                    </span>
                                </h2>
                                <p className="[margin:0] [margin-right:auto] [margin-left:auto] [max-width:512px] [font-size:10px] [line-height:1.6] [color:#3d3d3d]">
                                    <b>
                                        Semakin cepat kamu mulai, semakin besar
                                        peluang kamu diterima beasiswa
                                    </b>{' '}
                                    karena skor 500+ tercapai sebelum deadline
                                    submission.
                                </p>
                            </div>

                            <div className="[margin-bottom:44px] [text-align:center]">
                                <p className="[margin:0_0_6px] [font-size:13px] [font-weight:800] [letter-spacing:0.08em] [color:#3D4349] [text-transform:uppercase]">
                                    👇 Pilih Cara Belajarmu
                                </p>

                                <div className="[display:inline-flex] [gap:4px] [border-radius:9999px] [padding:5px] [box-shadow:0_2px_12px_rgba(215,8,8,0.08)] [background:#fff] [border:1px_solid_#ffb3b3]">
                                    <button
                                        onClick={() => setMode('self')}
                                        style={css(toggleBtnStyle(false))}
                                    >
                                        Belajar Sendiri
                                    </button>
                                    <button
                                        onClick={() => setMode('tutor')}
                                        style={css(toggleBtnStyle(true))}
                                    >
                                        Dibimbing Tutor
                                        <span className="[position:absolute] [top:-9px] [right:-6px] [display:flex] [height:34px] [width:34px] [align-items:center] [justify-content:center] [border-radius:9999px] [background-color:#F9A316] [font-size:11px] [font-weight:900] [color:#fff] [box-shadow:0_2px_8px_rgba(249,115,22,0.4)] [border:2px_solid_#fff]">
                                            -80%
                                        </span>
                                    </button>
                                </div>
                            </div>

                            <div className="[margin-bottom:56px] [display:grid] [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] [gap:24px]">
                                {/* Starter */}
                                <div className="[display:flex] [flex-direction:column] [border-radius:24px] [padding:28px] [box-shadow:0_4px_24px_rgba(0,0,0,0.06)] [border:2px_solid_#e5e7eb]">
                                    <div className="[margin-bottom:4px] [display:flex] [align-items:flex-start] [justify-content:space-between]">
                                        <div>
                                            <p className="[margin:0_0_4px] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [color:#9ca3af] [text-transform:uppercase]">
                                                Paket
                                            </p>
                                            <h3 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:24px] [font-weight:900] [color:#151515]">
                                                Starter
                                            </h3>
                                        </div>
                                        <span className="[display:flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [color:#16a34a] [background:#F0FDF4]">
                                            ★★★★★
                                            <span className="[margin-left:4px]">
                                                5.0
                                            </span>
                                        </span>
                                    </div>
                                    <p className="[margin:0_0_16px] [font-size:15px] [font-weight:700] [color:#4b5563]">
                                        Target Skor:{' '}
                                        <span className="[font-size:20px] [font-weight:900] [color:#16a34a]">
                                            450+
                                        </span>{' '}
                                        ·{' '}
                                        <span className="[font-weight:900] [color:#151515]">
                                            10 Hari (2 Minggu)
                                        </span>
                                    </p>
                                    <div className="[margin-bottom:20px] [border-radius:16px] [padding:16px] [background:#FFF0F0] [border:1.5px_solid_#ffb3b3]">
                                        <div className="[margin-bottom:4px] [display:flex] [align-items:center] [gap:8px]">
                                            <span className="[font-size:14px] [font-weight:600] [color:#9ca3af] [text-decoration:line-through]">
                                                Rp 1.000.000
                                            </span>
                                            <span className="[border-radius:9999px] [padding:2px_8px] [font-size:12px] [font-weight:900] [color:#fff] [background:#D70808]">
                                                HEMAT 80%
                                            </span>
                                        </div>
                                        <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:30px] [font-weight:900] [color:#D70808]">
                                            Rp 200.000
                                        </p>
                                    </div>
                                    <ul className="[margin:0_0_8px] [display:flex] [flex:1] [flex-direction:column] [gap:8px] [padding:0] [list-style:none]">
                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:800] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            LIVE ZOOM 10 Hari
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:800] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Akses Latihan Soal di LMS (Total
                                            370+ Soal)
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:800] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Post Test (Full Test) 1x
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Evaluasi Progress Mingguan
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Strategi Submit Sesuai Jurusan &amp;
                                            Rencana Kontribusi
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Rekaman ZOOM jika tidak hadir
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            30+ Video Materi Pembelajaran
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            E-Book Structure
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            E-Book Listening dan Reading
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Grup WA Diskusi
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Placement Test / Pre-Test
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            10+ Link Soal Tambahan saat LIVE
                                            ZOOM
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Tutor Tanya AI 24 Jam di setiap
                                            materi
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Pembahasan setiap soal di LMS
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#3b82f6]">
                                                🌐
                                            </span>
                                            Webinar Beasiswa Luar Negeri
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#3b82f6]">
                                                🌐
                                            </span>
                                            Konsultasi Kampus Luar Negeri, urus
                                            LoA, Visa, dll.
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#D70808]"></span>
                                            Bonus Spesial
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Sertifikat TOEFL
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#d1d5db]">
                                                ✕
                                            </span>
                                            Tidak termasuk garansi mengulang 1
                                            bulan
                                        </li>
                                    </ul>
                                    <div className="[display:flex] [flex-direction:column] [gap:6px]">
                                        <TrackedCTA
                                            zone="pricing"
                                            action="external_checkout"
                                            label="Apply Starter"
                                            href="https://member.fullbrightindonesia.com/paket-premium-toefl-level-starter-live-zoom-intensif-flash-sale"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={markCheckoutClicked}
                                            className="[box-sizing:border-box] [display:inline-flex] [width:100%] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:16px_20px] [font-size:16px] [font-weight:900] [color:#fff] [box-shadow:0_6px_24px_rgba(215,8,8,0.4)] [background:#D70808] [text-decoration:none]"
                                            style={{ color: '#fff', background: '#D70808' }}
                                        >
                                            Apply Sekarang →
                                        </TrackedCTA>
                                        <p className="[margin:0] [display:flex] [align-items:center] [justify-content:center] [gap:4px] [text-align:center] [font-size:12px] [color:#9ca3af]">
                                            🔒 Pembayaran aman &amp; terenkripsi
                                        </p>
                                    </div>
                                    <div className="[margin:12px_0] [display:flex] [align-items:center] [gap:12px]">
                                        <div className="[height:1px] [flex:1] [background:#e5e7eb]"></div>
                                        <span className="[font-size:12px] [font-weight:600] [color:#9ca3af]">
                                            atau
                                        </span>
                                        <div className="[height:1px] [flex:1] [background:#e5e7eb]"></div>
                                    </div>
                                    <TrackedCTA
                                        zone="pricing"
                                        action="whatsapp"
                                        label="Tanya Starter via WhatsApp"
                                        href="https://wa.me/6285255499299?text=Halo%20Admin%20Full%20Bright%20Indonesia.%20Saya%20minat%20mau%20daftar%20kelas%20TOEFL%20Level%20Starter"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="[box-sizing:border-box] [display:inline-flex] [width:100%] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:12px_20px] [font-size:14px] [font-weight:700] [color:#16a34a] [background:transparent] [border:1.5px_solid_#25D366] [text-decoration:none]"
                                    >
                                        <img
                                            src="/assets/admin-avatar.jpg"
                                            alt="Admin Full Bright"
                                            className="[height:26px] [width:26px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover] [border:2px_solid_#25D366]"
                                        />
                                        💬 Tanya via WhatsApp
                                    </TrackedCTA>
                                    <div className="[margin-top:14px] [display:flex] [flex-wrap:wrap] [align-items:center] [justify-content:center] [gap:6px]">
                                        <span className="[display:inline-flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [color:#B45309] [background:#FEF3C7]">
                                            ★ 4.9/5
                                        </span>
                                        <span className="[display:inline-flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [color:#15803d] [background:#F0FDF4]">
                                            45.000+
                                        </span>
                                        <span className="[display:inline-flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [color:#1d4ed8] [background:#EFF6FF]">
                                            🛡 Garansi 100%
                                        </span>
                                    </div>
                                </div>

                                {/* Bundling */}
                                <div className="[position:relative] [display:flex] [flex-direction:column] [overflow:hidden] [border-radius:24px] [padding:28px] [box-shadow:0_16px_56px_rgba(22,163,74,0.2),0_0_0_1px_rgba(22,163,74,0.08)] [background:linear-gradient(165deg,#ffffff_0%,#f0fdf4_100%)] [border:2px_solid_#16a34a]">
                                    <div className="[position:absolute] [top:0] [right:0] [border-bottom-left-radius:16px] [padding:8px_16px] [font-family:Nunito,sans-serif] [font-size:12px] [font-weight:900] [color:#fff] [background:#16a34a]">
                                        ⭐ PALING HEMAT
                                    </div>
                                    <div className="[margin-top:20px] [margin-bottom:4px] [display:flex] [align-items:flex-start] [justify-content:space-between]">
                                        <div>
                                            <p className="[margin:0_0_4px] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [color:#D70808] [text-transform:uppercase]">
                                                Paket
                                            </p>
                                            <h3 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:24px] [font-weight:900] [color:#151515]">
                                                Bundling
                                            </h3>
                                            <p className="[margin:2px_0_0] [font-size:12px] [font-weight:600] [color:#D70808]">
                                                Starter + Intermediate
                                            </p>
                                        </div>
                                        <span className="[display:flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [color:#D70808] [background:#FFF0F0]">
                                            ★★★★★
                                            <span className="[margin-left:4px]">
                                                5.0
                                            </span>
                                        </span>
                                    </div>
                                    <p className="[margin:0_0_16px] [font-size:15px] [font-weight:700] [color:#4b5563]">
                                        Target Skor:{' '}
                                        <span className="[font-size:20px] [font-weight:900] [color:#D70808]">
                                            500+
                                        </span>{' '}
                                        ·{' '}
                                        <span className="[font-weight:900] [color:#151515]">
                                            25 Hari Total
                                        </span>
                                    </p>
                                    <div className="[margin-bottom:20px] [border-radius:16px] [padding:16px] [background:#FFF0F0] [border:1.5px_solid_#ffb3b3]">
                                        <div className="[margin-bottom:4px] [display:flex] [align-items:center] [gap:8px]">
                                            <span className="[font-size:14px] [font-weight:600] [color:#9ca3af] [text-decoration:line-through]">
                                                Rp 1.875.000
                                            </span>
                                            <span className="[border-radius:9999px] [padding:2px_8px] [font-size:12px] [font-weight:900] [color:#fff] [background:#D70808]">
                                                DISKON 80% + Rp50rb
                                            </span>
                                        </div>
                                        <p className="[margin:0_0_4px] [font-family:Nunito,sans-serif] [font-size:30px] [font-weight:900] [color:#D70808]">
                                            Rp 325.000
                                        </p>
                                        <p className="[margin:0] [font-size:12px] [font-weight:600] [color:#D70808]">
                                            Hemat Rp 1.550.000 dari harga
                                            normal!
                                        </p>
                                    </div>
                                    <ul className="[margin:0_0_8px] [display:flex] [flex:1] [flex-direction:column] [gap:8px] [padding:0] [list-style:none]">
                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:800] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            LIVE ZOOM 25 Hari
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:800] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Akses Latihan Soal di LMS (Total
                                            1.370+ Soal)
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:800] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Progress Test &amp; Post Test (Full
                                            Test) 3x
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Evaluasi Progress Mingguan
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Strategi Submit Sesuai Jurusan &amp;
                                            Rencana Kontribusi
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Rekaman ZOOM jika tidak hadir
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            90+ Video Materi Pembelajaran
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            E-Book Structure (500+ Soal)
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            E-Book Listening dan Reading
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Grup WA Diskusi
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Placement Test / Pre-Test
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            25 Link Soal Tambahan saat LIVE ZOOM
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Free mengulang 1 bulan jika belum
                                            capai skor 500+
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Tutor Tanya AI 24 Jam di setiap
                                            materi
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Pembahasan setiap soal di LMS
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#3b82f6]">
                                                🌐
                                            </span>
                                            Webinar Beasiswa Luar Negeri
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#3b82f6]">
                                                🌐
                                            </span>
                                            Konsultasi Kampus Luar Negeri, urus
                                            LoA, Visa, dll.
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#D70808]"></span>
                                            Bonus Spesial
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Sertifikat TOEFL
                                        </li>
                                    </ul>
                                    <div className="[margin-bottom:20px] [display:grid] [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))] [gap:12px]">
                                        <div className="[border-radius:16px] [padding:16px] [background:#F3F3F3]">
                                            <div className="[margin-bottom:8px] [display:flex] [align-items:center] [gap:10px]">
                                                <div className="[display:flex] [height:32px] [width:32px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:10px] [background:#FEF3C7]">
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="#F59E0B"
                                                        stroke="#F59E0B"
                                                    >
                                                        <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"></path>
                                                    </svg>
                                                </div>
                                                <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:13px] [line-height:1.3] [font-weight:900] [color:#151515]">
                                                    Garansi Sampai Skor Tercapai
                                                </p>
                                            </div>
                                            <p className="[margin:0] [font-size:12px] [line-height:1.5] [color:#6b7280]">
                                                Ikut program secara penuh dan
                                                konsisten, tapi skor belum
                                                tercapai, gratis ulang kelas di
                                                batch berikutnya.
                                            </p>
                                        </div>
                                        <div className="[border-radius:16px] [padding:16px] [background:#F3F3F3]">
                                            <div className="[margin-bottom:8px] [display:flex] [align-items:center] [gap:10px]">
                                                <div className="[display:flex] [height:32px] [width:32px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:10px] [background:#FEF3C7]">
                                                    <svg
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="#F59E0B"
                                                        stroke="#F59E0B"
                                                    >
                                                        <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"></path>
                                                    </svg>
                                                </div>
                                                <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:13px] [line-height:1.3] [font-weight:900] [color:#151515]">
                                                    Post Test Ulang 3× Gratis
                                                </p>
                                            </div>
                                            <p className="[margin:0] [font-size:12px] [line-height:1.5] [color:#6b7280]">
                                                Belum puas hasilnya? Ulang ujian
                                                akhir hingga 3 kali, gratis.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="[display:flex] [flex-direction:column] [gap:6px]">
                                        <TrackedCTA
                                            zone="pricing"
                                            action="external_checkout"
                                            label="Apply Bundle"
                                            href="https://member.fullbrightindonesia.com/paket-premium-toefl-level-starter-live-zoom-intensif-flash-sale"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={markCheckoutClicked}
                                            className="[box-sizing:border-box] [display:inline-flex] [width:100%] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:16px_20px] [font-size:16px] [font-weight:900] [color:#fff] [box-shadow:0_6px_24px_rgba(22,163,74,0.4)] [background:#16a34a] [text-decoration:none]"
                                            style={{ color: '#fff', background: '#16a34a' }}
                                        >
                                            Apply Sekarang →
                                        </TrackedCTA>
                                        <p className="[margin:0] [display:flex] [align-items:center] [justify-content:center] [gap:4px] [text-align:center] [font-size:12px] [color:#9ca3af]">
                                            🔒 Pembayaran aman &amp; terenkripsi
                                        </p>
                                    </div>
                                    <p className="[margin:6px_0_0] [text-align:center] [font-size:12px] [font-weight:600] [color:#D70808]">
                                        * Centang opsi Bundle saat checkout
                                    </p>
                                    <div className="[margin:12px_0] [display:flex] [align-items:center] [gap:12px]">
                                        <div className="[height:1px] [flex:1] [background:#e5e7eb]"></div>
                                        <span className="[font-size:12px] [font-weight:600] [color:#9ca3af]">
                                            atau
                                        </span>
                                        <div className="[height:1px] [flex:1] [background:#e5e7eb]"></div>
                                    </div>
                                    <TrackedCTA
                                        zone="pricing"
                                        action="whatsapp"
                                        label="Tanya Bundle via WhatsApp"
                                        href="https://wa.me/6285255499299?text=Halo%20Admin%20Full%20Bright%20Indonesia.%20Saya%20minat%20mau%20daftar%20paket%20HEMAT%20TOEFL%20Level%20Starter%20%2B%20Intermediate."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="[box-sizing:border-box] [display:inline-flex] [width:100%] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:12px_20px] [font-size:14px] [font-weight:700] [color:#16a34a] [background:transparent] [border:1.5px_solid_#25D366] [text-decoration:none]"
                                    >
                                        <img
                                            src="/assets/admin-avatar.jpg"
                                            alt="Admin Full Bright"
                                            className="[height:26px] [width:26px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover] [border:2px_solid_#25D366]"
                                        />
                                        💬 Tanya via WhatsApp
                                    </TrackedCTA>
                                    <div className="[margin-top:14px] [display:flex] [flex-wrap:wrap] [align-items:center] [justify-content:center] [gap:6px]">
                                        <span className="[display:inline-flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [color:#B45309] [background:#FEF3C7]">
                                            ★ 4.9/5
                                        </span>
                                        <span className="[display:inline-flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [color:#15803d] [background:#F0FDF4]">
                                            45.000+
                                        </span>
                                        <span className="[display:inline-flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [color:#1d4ed8] [background:#EFF6FF]">
                                            🛡 Garansi 100%
                                        </span>
                                    </div>
                                </div>

                                {/* Intermediate */}
                                <div className="[display:flex] [flex-direction:column] [border-radius:24px] [padding:28px] [box-shadow:0_4px_24px_rgba(0,0,0,0.06)] [border:2px_solid_#e5e7eb]">
                                    <div className="[margin-bottom:4px] [display:flex] [align-items:flex-start] [justify-content:space-between]">
                                        <div>
                                            <p className="[margin:0_0_4px] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [color:#9ca3af] [text-transform:uppercase]">
                                                Paket
                                            </p>
                                            <h3 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:24px] [font-weight:900] [color:#151515]">
                                                Intermediate
                                            </h3>
                                        </div>
                                        <span className="[display:flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [color:#16a34a] [background:#F0FDF4]">
                                            ★★★★★
                                            <span className="[margin-left:4px]">
                                                5.0
                                            </span>
                                        </span>
                                    </div>
                                    <p className="[margin:0_0_16px] [font-size:15px] [font-weight:700] [color:#4b5563]">
                                        Target Skor:{' '}
                                        <span className="[font-size:20px] [font-weight:900] [color:#16a34a]">
                                            500+
                                        </span>{' '}
                                        ·{' '}
                                        <span className="[font-weight:900] [color:#151515]">
                                            15 Hari
                                        </span>{' '}
                                        · Min. 430
                                    </p>
                                    <div className="[margin-bottom:20px] [border-radius:16px] [padding:16px] [background:#FFF0F0] [border:1.5px_solid_#ffb3b3]">
                                        <div className="[margin-bottom:4px] [display:flex] [align-items:center] [gap:8px]">
                                            <span className="[font-size:14px] [font-weight:600] [color:#9ca3af] [text-decoration:line-through]">
                                                Rp 1.400.000
                                            </span>
                                            <span className="[border-radius:9999px] [padding:2px_8px] [font-size:12px] [font-weight:900] [color:#fff] [background:#D70808]">
                                                DISKON 80%
                                            </span>
                                        </div>
                                        <p className="[margin:0] [font-family:Nunito,sans-serif] [font-size:30px] [font-weight:900] [color:#D70808]">
                                            Rp 280.000
                                        </p>
                                    </div>
                                    <ul className="[margin:0_0_8px] [display:flex] [flex:1] [flex-direction:column] [gap:8px] [padding:0] [list-style:none]">
                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:800] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            LIVE ZOOM 15 Hari
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:800] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Akses Latihan Soal di LMS (Total
                                            1000+ Soal)
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:800] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Progress Test &amp; Post Test (Full
                                            Test) 2x
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Evaluasi Progress Mingguan
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Strategi Submit Sesuai Jurusan &amp;
                                            Rencana Kontribusi
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Rekaman ZOOM jika tidak hadir
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            60+ Video Materi Pembelajaran
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            E-Book Structure
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            E-Book Listening dan Reading
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Grup WA Diskusi
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Placement Test / Pre-Test
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            15 Link Soal Tambahan saat LIVE ZOOM
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Tutor Tanya AI 24 Jam di setiap
                                            materi
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Pembahasan setiap soal di LMS
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#3b82f6]">
                                                🌐
                                            </span>
                                            Webinar Beasiswa Luar Negeri
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#3b82f6]">
                                                🌐
                                            </span>
                                            Konsultasi Kampus Luar Negeri, urus
                                            LoA, Visa, dll.
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#D70808]"></span>
                                            Bonus Spesial
                                        </li>

                                        <li className="[display:flex] [align-items:flex-start] [gap:8px] [font-size:14px] [font-weight:500] [color:#3d3d3d]">
                                            <span className="[margin-top:1px] [flex-shrink:0] [color:#16a34a]">
                                                ✓
                                            </span>
                                            Sertifikat TOEFL
                                        </li>
                                    </ul>
                                    <div className="[display:flex] [flex-direction:column] [gap:6px]">
                                        <TrackedCTA
                                            zone="pricing"
                                            action="external_checkout"
                                            label="Apply Intermediate"
                                            href="https://member.fullbrightindonesia.com/paket-premium-toefl-level-intermediate-live-zoom-intensif-flash-sale"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={markCheckoutClicked}
                                            className="[box-sizing:border-box] [display:inline-flex] [width:100%] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:16px_20px] [font-size:16px] [font-weight:900] [color:#fff] [box-shadow:0_6px_24px_rgba(215,8,8,0.4)] [background:#D70808] [text-decoration:none]"
                                            style={{ color: '#fff', background: '#D70808' }}
                                        >
                                            Apply Sekarang →
                                        </TrackedCTA>
                                        <p className="[margin:0] [display:flex] [align-items:center] [justify-content:center] [gap:4px] [text-align:center] [font-size:12px] [color:#9ca3af]">
                                            🔒 Pembayaran aman &amp; terenkripsi
                                        </p>
                                    </div>
                                    <div className="[margin:12px_0] [display:flex] [align-items:center] [gap:12px]">
                                        <div className="[height:1px] [flex:1] [background:#e5e7eb]"></div>
                                        <span className="[font-size:12px] [font-weight:600] [color:#9ca3af]">
                                            atau
                                        </span>
                                        <div className="[height:1px] [flex:1] [background:#e5e7eb]"></div>
                                    </div>
                                    <TrackedCTA
                                        zone="pricing"
                                        action="whatsapp"
                                        label="Tanya Intermediate via WhatsApp"
                                        href="https://wa.me/6285255499299?text=Halo%20Admin%20Full%20Bright%20Indonesia.%20Saya%20minat%20mau%20daftar%20kelas%20TOEFL%20Level%20Intermediate."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="[box-sizing:border-box] [display:inline-flex] [width:100%] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:12px_20px] [font-size:14px] [font-weight:700] [color:#16a34a] [background:transparent] [border:1.5px_solid_#25D366] [text-decoration:none]"
                                    >
                                        <img
                                            src="/assets/admin-avatar.jpg"
                                            alt="Admin Full Bright"
                                            className="[height:26px] [width:26px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover] [border:2px_solid_#25D366]"
                                        />
                                        💬 Tanya via WhatsApp
                                    </TrackedCTA>
                                    <div className="[margin-top:14px] [display:flex] [flex-wrap:wrap] [align-items:center] [justify-content:center] [gap:6px]">
                                        <span className="[display:inline-flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [color:#B45309] [background:#FEF3C7]">
                                            ★ 4.9/5
                                        </span>
                                        <span className="[display:inline-flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [color:#15803d] [background:#F0FDF4]">
                                            45.000+
                                        </span>
                                        <span className="[display:inline-flex] [align-items:center] [gap:4px] [border-radius:9999px] [padding:4px_10px] [font-size:12px] [font-weight:600] [color:#1d4ed8] [background:#EFF6FF]">
                                            🛡 Garansi 100%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="[margin:0_auto_32px] [max-width:672px] [border-radius:16px] [padding:24px] [background:#F3F3F3] [border:1px_solid_#e5e7eb]">
                                <p className="[margin:0_0_12px] [font-size:12px] [font-weight:900] [letter-spacing:0.08em] [color:#9ca3af] [text-transform:uppercase]">
                                    Legalitas Resmi
                                </p>
                                <div className="[display:flex] [flex-direction:column] [gap:6px]">
                                    <span className="[font-size:12px] [font-weight:600] [color:#151515]">
                                        ✓ SK Kemenkumham RI Nomor
                                        AHU-0055720-AH.0114 Tahun 2020
                                    </span>
                                    <span className="[font-size:12px] [font-weight:600] [color:#151515]">
                                        ✓ SK Izin Operasional LKP
                                        503/20177/LKP/DPM-PTSP/8/2024
                                    </span>
                                    <span className="[font-size:12px] [font-weight:600] [color:#151515]">
                                        ✓ NPSN Nomor K9998700
                                    </span>
                                    <span className="[font-size:12px] [font-weight:600] [color:#151515]">
                                        ✓ Bekerja sama dengan IIEF Jakarta
                                    </span>
                                </div>
                                <a
                                    href="https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/K9998700"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="[margin-top:12px] [display:inline-block] [font-size:12px] [font-weight:600] [color:#D70808] [text-decoration:none]"
                                >
                                    Info Detail Legalitas →
                                </a>
                            </div>
                        </div>
                    </section>
                </>
            ) : null}

            {/* FAQ */}
            <section
                id="faq"
                className="[padding:80px_24px_48px] [background:#F3F3F3]"
            >
                <div className="[margin:0_auto] [max-width:1152px]">
                    <div className="[margin-bottom:56px] [text-align:left]">
                        <div className="[margin-bottom:20px] [display:inline-flex] [align-items:center] [gap:8px] [border-radius:9999px] [padding:6px_16px] [font-size:12px] [font-weight:700] [letter-spacing:0.08em] [color:#D70808] [text-transform:uppercase] [background:#FFF0F0] [border:1px_solid_#ffb3b3]">
                            ❓ Masih Ragu?
                        </div>
                        <h2 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:clamp(24px,3vw,36px)] [font-weight:900] [color:#151515]">
                            Apakah Kamu Benar-Benar{' '}
                            <span className="[color:#D70808]">
                                Butuh Ini Sekarang?
                            </span>
                        </h2>
                    </div>

                    <div className="[margin-bottom:32px] [display:flex] [flex-wrap:wrap] [justify-content:center] [gap:8px]">
                        <button
                            onClick={() => setActiveCat(null)}
                            style={css(catBtnStyle(activeCat === null))}
                        >
                            Semua
                        </button>

                        <button
                            onClick={() => toggleCat(0)}
                            style={css(
                                catBtnStyle(activeCat === FAQ_CATEGORIES[-1]),
                            )}
                        >
                            Belajar Mandiri (LMS)
                        </button>

                        <button
                            onClick={() => toggleCat(1)}
                            style={css(
                                catBtnStyle(activeCat === FAQ_CATEGORIES[-1]),
                            )}
                        >
                            Metode &amp; Efektivitas
                        </button>

                        <button
                            onClick={() => toggleCat(2)}
                            style={css(
                                catBtnStyle(activeCat === FAQ_CATEGORIES[-1]),
                            )}
                        >
                            Dibimbing Tutor
                        </button>

                        <button
                            onClick={() => toggleCat(3)}
                            style={css(
                                catBtnStyle(activeCat === FAQ_CATEGORIES[-1]),
                            )}
                        >
                            Sertifikat &amp; Legalitas
                        </button>

                        <button
                            onClick={() => toggleCat(4)}
                            style={css(
                                catBtnStyle(activeCat === FAQ_CATEGORIES[-1]),
                            )}
                        >
                            Pendaftaran &amp; Pembayaran
                        </button>

                        <button
                            onClick={() => toggleCat(5)}
                            style={css(
                                catBtnStyle(activeCat === FAQ_CATEGORIES[-1]),
                            )}
                        >
                            Jaminan &amp; Garansi
                        </button>
                    </div>

                    <div className="[margin:0_auto_48px] [max-width:768px] [border-radius:24px] [padding:0_28px] [box-shadow:0_4px_24px_rgba(0,0,0,0.06)] [background:#fff]">
                        <div style={css(faqItemStyle(activeCat, 0))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 0 ? null : 0)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 0))}>
                                    Kalau ambil paket Self-Study LMS, apa saja
                                    yang saya dapat?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 0))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 0 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Kamu dapat akses penuh ke LMS Full
                                            Bright: 60+ video materi Full Skills
                                            (Listening, Structure, Reading),
                                            materi terstruktur hari ke-1 sampai
                                            ke-15, 1.000+ nomor latihan soal
                                            beserta pembahasan, diagnostic test,
                                            simulasi dan post test full skills,
                                            serta grup WA diskusi. Semua bisa
                                            diakses kapan saja tanpa terikat
                                            jadwal kelas.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 1))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 1 ? null : 1)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 1))}>
                                    Bagaimana cara akses LMS setelah saya bayar?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 1))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 1 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Setelah pembayaran berhasil, kamu
                                            langsung menerima email berisi link
                                            dan akun untuk masuk ke platform LMS
                                            Full Bright. Akses berlaku 2 tahun
                                            dan bisa dibuka dari HP maupun
                                            laptop, kapan pun kamu punya waktu.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 2))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 2 ? null : 2)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 2))}>
                                    Saya belajar sendiri di LMS. Kalau bingung,
                                    bisa tanya ke siapa?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 2))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 2 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Kamu tetap tidak belajar sendirian.
                                            Setiap peserta LMS masuk ke grup WA
                                            diskusi, jadi kalau ada soal atau
                                            materi yang bikin bingung, kamu bisa
                                            langsung bertanya dan dibantu. Ini
                                            bedanya dengan belajar otodidak dari
                                            YouTube — di sana tidak ada yang
                                            menjawab kalau kamu stuck.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 3))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 3 ? null : 3)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 3))}>
                                    Apakah bisa dicoba dulu sebelum bayar?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 3))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 3 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Bisa. Tersedia free trial LMS dengan
                                            akses 1 modul agar kamu bisa
                                            merasakan sendiri kualitas video
                                            materi dan latihan soalnya sebelum
                                            memutuskan. Kalau cocok, tinggal
                                            lanjut ambil paketnya.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 4))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 4 ? null : 4)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 4))}>
                                    Apakah bisa belajar tanpa terikat jadwal
                                    karena saya sibuk?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 4))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 4 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Justru itu kelebihan paket belajar
                                            mandiri: tidak ada jam kelas yang
                                            harus dikejar. Semua materi tersedia
                                            di LMS 24/7 dan bisa diulang berapa
                                            kali pun. Banyak alumni kami
                                            karyawan, PNS aktif, dan mahasiswa
                                            tingkat akhir yang belajar di
                                            sela-sela kesibukan.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 5))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 5 ? null : 5)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 5))}>
                                    Apakah metode ini cocok untuk pemula yang
                                    grammar-nya sangat lemah?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 5))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 5 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Sangat cocok. Materi disusun dari
                                            level dasar dan berurutan hari ke-1
                                            sampai ke-15, jadi kamu tidak perlu
                                            grammar sempurna untuk memulai.
                                            Fokusnya bukan menguasai semua tata
                                            bahasa Inggris, tapi mengenali pola
                                            soal yang benar-benar keluar di
                                            TOEFL ITP.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 6))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 6 ? null : 6)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 6))}>
                                    Kenapa belajar di sini beda dengan belajar
                                    sendiri dari buku dan YouTube?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 6))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 6 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Dua hal yang paling sering bikin
                                            belajar otodidak gagal: materinya
                                            tidak terstruktur dan tidak ada yang
                                            bisa ditanya kalau salah. Di Full
                                            Bright, materi sudah berurutan dan
                                            fokus ke pola soal TOEFL, setiap
                                            latihan ada pembahasannya, dan ada
                                            grup diskusi untuk bertanya.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 7))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 7 ? null : 7)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 7))}>
                                    Berapa kenaikan skor yang bisa saya
                                    harapkan?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 7))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 7 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Berdasarkan data alumni, peserta
                                            yang mengikuti materi secara
                                            konsisten dan mengerjakan semua bank
                                            soal rata-rata naik 80–100 poin.
                                            Yang paling banyak dirasakan alumni
                                            adalah jadi paham pola soal TOEFL,
                                            dan dari situ skornya ikut naik.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 8))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 8 ? null : 8)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 8))}>
                                    Apakah dijamin bisa mencapai skor 500?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 8))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 8 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Kami tidak menjanjikan skor 500
                                            secara mutlak karena hasil
                                            tergantung konsistensi masing-masing
                                            peserta. Yang bisa kami jamin:
                                            metode yang sudah terbukti pada
                                            45.000+ alumni, materi yang fokus
                                            dan terstruktur, serta pendampingan
                                            selama program.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 9))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 9 ? null : 9)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 9))}>
                                    Apakah ada batasan usia untuk mengikuti
                                    program ini?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 9))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 9 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Program terbuka untuk usia 17 hingga
                                            45 tahun. Cocok untuk pelajar,
                                            mahasiswa, fresh graduate, maupun
                                            karyawan yang butuh skor TOEFL untuk
                                            studi, karir, atau beasiswa.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 10))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 10 ? null : 10)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 10))}>
                                    Apa bedanya paket Dibimbing Tutor dengan
                                    Self-Study LMS?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 10))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 10 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Semua materi LMS tetap kamu dapat.
                                            Tambahannya khusus di paket
                                            Dibimbing Tutor: LIVE ZOOM 15 hari
                                            bersama instruktur, rekaman ZOOM,
                                            dan sertifikat TOEFL Prediction.
                                            Cocok kalau kamu merasa lebih
                                            terbantu dengan penjelasan langsung
                                            dan tempo belajar yang dipandu.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 11))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 11 ? null : 11)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 11))}>
                                    Kapan jadwal LIVE ZOOM-nya dan apakah bisa
                                    dipilih?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 11))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 11 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Khusus paket Dibimbing Tutor.
                                            Tersedia 5 pilihan sesi harian: •
                                            Pagi (09.00 – 10.00 WIB) • Siang
                                            (13.00 – 14.00 WIB) • Sore (16.00 –
                                            17.00 WIB) • Malam (19.00 – 20.00
                                            WIB) • Malam (20.15 – 21.15 WIB)
                                            Catatan: Jika berhalangan hadir LIVE
                                            ZOOM, jangan khawatir — materi bisa
                                            diakses di rekaman ZOOM.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 12))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 12 ? null : 12)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 12))}>
                                    Kalau saya tidak bisa hadir LIVE ZOOM,
                                    bagaimana?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 12))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 12 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Khusus paket Dibimbing Tutor. Setiap
                                            sesi direkam dan rekamannya bisa
                                            diakses seumur hidup, jadi kamu
                                            tetap bisa mengejar materi kalau
                                            berhalangan hadir. Kelas hanya 60
                                            menit per hari agar tetap muat di
                                            jadwal yang padat.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 13))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 13 ? null : 13)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 13))}>
                                    Apakah saya dapat sertifikat TOEFL?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 13))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 13 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Sertifikat TOEFL Prediction
                                            diberikan khusus untuk paket
                                            Dibimbing Tutor setelah mengikuti
                                            post test. Paket Self-Study LMS
                                            fokus pada materi dan latihan, tanpa
                                            sertifikat.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 14))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 14 ? null : 14)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 14))}>
                                    Apakah lembaganya resmi dan sertifikatnya
                                    valid?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 14))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 14 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Full Bright Indonesia adalah lembaga
                                            resmi dengan legalitas lengkap: SK
                                            Kemenkumham RI Nomor
                                            AHU-0055720-AH.0114 Tahun 2020, SK
                                            Izin Operasional LKP
                                            503/20177/LKP/DPM-PTSP/8/2024, NPSN
                                            Nomor K9998700, dan bekerja sama
                                            dengan IIEF Jakarta. Sertifikat
                                            dapat digunakan untuk daftar kuliah
                                            S1/S2/S3, lamar kerja, seleksi CPNS,
                                            rekrutmen BUMN, ujian skripsi,
                                            kenaikan pangkat, dan pendaftaran
                                            beasiswa.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 15))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 15 ? null : 15)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 15))}>
                                    Bagaimana cara mendaftar dan metode
                                    pembayaran apa saja?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 15))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 15 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Klik tombol daftar, pilih paket yang
                                            sesuai, lalu selesaikan pembayaran.
                                            Setelah itu kamu langsung menerima
                                            email konfirmasi beserta akses LMS
                                            dan grup WhatsApp. Pembayaran bisa
                                            via transfer bank, GoPay, OVO, DANA,
                                            dan QRIS.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div style={css(faqItemStyle(activeCat, 16))}>
                            <button
                                onClick={() =>
                                    setOpenFaq(openFaq === 16 ? null : 16)
                                }
                                className="[display:flex] [width:100%] [cursor:pointer] [align-items:flex-start] [justify-content:space-between] [gap:16px] [padding:20px_0] [text-align:left] [background:none] [border:none]"
                            >
                                <span style={css(faqQStyle(openFaq === 16))}>
                                    Apakah ada garansi kalau skor saya belum
                                    mencapai target?
                                </span>
                                <span style={css(faqChevStyle(openFaq === 16))}>
                                    ▾
                                </span>
                            </button>
                            {openFaq === 16 ? (
                                <>
                                    <div className="[padding:0_32px_24px_0]">
                                        <p className="[margin:0] [font-size:14px] [line-height:1.6] [white-space:pre-line] [color:#3d3d3d]">
                                            Garansi mengulang sampai skor target
                                            tercapai berlaku khusus untuk Paket
                                            Bundling (Dibimbing Tutor). Jika
                                            sudah mengikuti program secara penuh
                                            dan konsisten tapi skor belum
                                            tercapai, kamu bisa claim garansi
                                            dan mengulang kelas di batch
                                            berikutnya.
                                        </p>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>

                    <div className="[margin:0_auto] [max-width:512px] [text-align:center]">
                        <p className="[margin:0_0_24px] [font-size:14px] [font-weight:600] [color:#3d3d3d]">
                            Masih ada pertanyaan lain? Hubungi kami sekarang.
                        </p>
                        <div className="[display:flex] [flex-wrap:wrap] [justify-content:center] [gap:12px]">
                            <TrackedCTA
                                zone="faq"
                                action="whatsapp"
                                label="Chat Via WA"
                                href="https://wa.me/6285255499299?text=Halo%20Admin%20Full%20Bright%20Indonesia.%20Saya%20minat%20mau%20daftar%20kelas%20TOEFL.%20Saya%20mau%20tanya-tanya%20dulu."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:14px_28px] [font-size:16px] [font-weight:700] [color:#fff] [box-shadow:0_4px_20px_rgba(215,8,8,0.35)] [background:#D70808] [text-decoration:none]"
                            >
                                Chat Via WA →
                            </TrackedCTA>
                            <a
                                href="#testimonials"
                                className="[display:inline-flex] [align-items:center] [justify-content:center] [gap:8px] [border-radius:16px] [padding:14px_28px] [font-size:16px] [font-weight:700] [color:#151515] [border:2px_solid_#D70808] [text-decoration:none]"
                            >
                                Lihat Bukti Alumni →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing CTA */}

            {/* Survey */}
            <section
                id="survey"
                className="[padding:28px_24px] [background:#fff]"
            >
                <div className="[margin:0_auto] [max-width:460px] [border-radius:16px] [padding:20px_20px_16px] [background:#FAFAFA] [border:1px_solid_#ececec]">
                    <div className="[margin-bottom:16px]">
                        <p className="[margin:0_0_6px] [text-align:right] [font-size:11px] [font-weight:700] [letter-spacing:0.06em] [color:#6b6b6b] [text-transform:uppercase]">
                            BOLEH TAHU KESULITANMU?
                        </p>
                        <h2 className="[margin:0] [font-family:Nunito,sans-serif] [font-size:clamp(20px,3.6vw,23px)] [line-height:1.25] [font-weight:800] [color:#151515]">
                            Apa Tantangan Terbesarmu{' '}
                            <span className="[color:#D70808]">
                                Soal TOEFL Sekarang?
                            </span>
                        </h2>
                    </div>

                    <div className="[display:flex] [flex-direction:column] [gap:6px]">
                        <button
                            onClick={() => setSurveySelected(0)}
                            style={css(surveyOptStyle(surveySelected === 0))}
                        >
                            <span className="[flex:1] [text-align:left] [font-size:13px] [font-weight:500] [color:#151515]">
                                Bingung mulai belajar dari mana
                            </span>
                            {surveySelected === 0 ? (
                                <>
                                    <span className="flex [height:16px] [width:16px] shrink-0 items-center justify-center [border-radius:9999px] [font-size:9px] [font-weight:800] [color:#fff] [background:#D70808]">
                                        ✓
                                    </span>
                                </>
                            ) : null}
                        </button>

                        <button
                            onClick={() => setSurveySelected(1)}
                            style={css(surveyOptStyle(surveySelected === 1))}
                        >
                            <span className="[flex:1] [text-align:left] [font-size:13px] [font-weight:500] [color:#151515]">
                                Sudah belajar tapi skor masih stuck
                            </span>
                            {surveySelected === 1 ? (
                                <>
                                    <span className="flex [height:16px] [width:16px] shrink-0 items-center justify-center [border-radius:9999px] [font-size:9px] [font-weight:800] [color:#fff] [background:#D70808]">
                                        ✓
                                    </span>
                                </>
                            ) : null}
                        </button>

                        <button
                            onClick={() => setSurveySelected(2)}
                            style={css(surveyOptStyle(surveySelected === 2))}
                        >
                            <span className="[flex:1] [text-align:left] [font-size:13px] [font-weight:500] [color:#151515]">
                                Masih ragu apakah perlu ikut kursus
                            </span>
                            {surveySelected === 2 ? (
                                <>
                                    <span className="flex [height:16px] [width:16px] shrink-0 items-center justify-center [border-radius:9999px] [font-size:9px] [font-weight:800] [color:#fff] [background:#D70808]">
                                        ✓
                                    </span>
                                </>
                            ) : null}
                        </button>

                        <button
                            onClick={() => setSurveySelected(3)}
                            style={css(surveyOptStyle(surveySelected === 3))}
                        >
                            <span className="[flex:1] [text-align:left] [font-size:13px] [font-weight:500] [color:#151515]">
                                Lainnya
                            </span>
                            {surveySelected === 3 ? (
                                <>
                                    <span className="flex [height:16px] [width:16px] shrink-0 items-center justify-center [border-radius:9999px] [font-size:9px] [font-weight:800] [color:#fff] [background:#D70808]">
                                        ✓
                                    </span>
                                </>
                            ) : null}
                        </button>
                    </div>

                    <p style={css(surveyMsgStyle(surveySelected !== null))}>
                        ✓ Makasih! Jawabanmu sudah tercatat.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer
                id="footer"
                className="[padding:28px_16px_28px] [background:#151515]"
            >
                <div className="[margin:0_auto] [max-width:1152px]">
                    <div className="[margin-bottom:40px] [display:grid] [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] [gap:40px]">
                        <div>
                            <div className="[margin-bottom:16px]">
                                <img
                                    src="https://toefl.fullbrightindonesia.org/logo/Logo-Fullbright.webp"
                                    alt="Full Bright Indonesia"
                                    className="[height:auto] [width:160px] [object-fit:contain] [filter:brightness(0)_invert(1)]"
                                />
                            </div>
                            <p className="[margin:0_0_16px] [font-size:12px] [line-height:1.6] [color:#9ca3af]">
                                SK Kemenkumham RI No. AHU-0055720-AH.0114 Tahun
                                2020
                                <br />
                                SK LKP No. 503/20177/LKP/DPM-PTSP/8/2024
                                <br />
                                NPSN K9998700 · Kerjasama dengan IIEF Jakarta
                            </p>
                            <div className="[display:flex] [gap:12px]">
                                <a
                                    href="https://www.instagram.com/fulbrightindonesia/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="[display:flex] [height:36px] [width:36px] [align-items:center] [justify-content:center] [border-radius:12px] [color:#9ca3af] [background:rgba(255,255,255,0.08)] [text-decoration:none]"
                                >
                                    <svg
                                        width="17"
                                        height="17"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <p className="[margin:0_0_20px] [font-size:12px] [font-weight:900] [letter-spacing:0.08em] [color:#6b7280] [text-transform:uppercase]">
                                Navigasi
                            </p>
                            <ul className="[margin:0] [display:flex] [flex-direction:column] [gap:12px] [padding:0] [list-style:none]">
                                <li>
                                    <a
                                        href="#value"
                                        className="[font-size:14px] [color:#9ca3af] [text-decoration:none]"
                                    >
                                        Keunggulan
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#testimonials"
                                        className="[font-size:14px] [color:#9ca3af] [text-decoration:none]"
                                    >
                                        Testimoni
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#pricing"
                                        onClick={scrollToPricing}
                                        className="[font-size:14px] [color:#9ca3af] [text-decoration:none]"
                                    >
                                        Harga
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#faq"
                                        className="[font-size:14px] [color:#9ca3af] [text-decoration:none]"
                                    >
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <p className="[margin:0_0_20px] [font-size:12px] [font-weight:900] [letter-spacing:0.08em] [color:#6b7280] [text-transform:uppercase]">
                                Hubungi Kami
                            </p>
                            <ul className="[margin:0] [display:flex] [flex-direction:column] [gap:16px] [padding:0] [list-style:none]">
                                <li className="[display:flex] [align-items:flex-start] [gap:12px]">
                                    <div className="[margin-top:2px] [display:flex] [height:32px] [width:32px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:8px] [color:#9ca3af] [background:rgba(255,255,255,0.08)]">
                                        💬
                                    </div>
                                    <div>
                                        <p className="[margin:0_0_2px] [font-size:12px] [font-weight:600] [color:#fff]">
                                            Ms. Aini
                                        </p>
                                        <a
                                            href="https://wa.me/6281959486507"
                                            className="[font-size:12px] [color:#9ca3af] [text-decoration:none]"
                                        >
                                            +62 819-5948-6507
                                        </a>
                                    </div>
                                </li>

                                <li className="[display:flex] [align-items:flex-start] [gap:12px]">
                                    <div className="[margin-top:2px] [display:flex] [height:32px] [width:32px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:8px] [color:#9ca3af] [background:rgba(255,255,255,0.08)]">
                                        💬
                                    </div>
                                    <div>
                                        <p className="[margin:0_0_2px] [font-size:12px] [font-weight:600] [color:#fff]">
                                            Mr. Choiri
                                        </p>
                                        <a
                                            href="https://wa.me/6288744875322"
                                            className="[font-size:12px] [color:#9ca3af] [text-decoration:none]"
                                        >
                                            +62 887-4487-5322
                                        </a>
                                    </div>
                                </li>

                                <li className="[display:flex] [align-items:flex-start] [gap:12px]">
                                    <div className="[margin-top:2px] [display:flex] [height:32px] [width:32px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:8px] [color:#9ca3af] [background:rgba(255,255,255,0.08)]">
                                        💬
                                    </div>
                                    <div>
                                        <p className="[margin:0_0_2px] [font-size:12px] [font-weight:600] [color:#fff]">
                                            Ms. Fini
                                        </p>
                                        <a
                                            href="https://wa.me/6285255499299"
                                            className="[font-size:12px] [color:#9ca3af] [text-decoration:none]"
                                        >
                                            +62 852-5549-9299
                                        </a>
                                    </div>
                                </li>

                                <li className="[display:flex] [align-items:flex-start] [gap:12px]">
                                    <div className="[margin-top:2px] [display:flex] [height:32px] [width:32px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:8px] [color:#9ca3af] [background:rgba(255,255,255,0.08)]">
                                        ✉
                                    </div>
                                    <div>
                                        <p className="[margin:0_0_2px] [font-size:12px] [font-weight:600] [color:#fff]">
                                            Email
                                        </p>
                                        <a
                                            href="mailto:info@fullbrightindonesia.org"
                                            className="[font-size:12px] [color:#9ca3af] [text-decoration:none]"
                                        >
                                            info@fullbrightindonesia.org
                                        </a>
                                    </div>
                                </li>
                                <li className="[display:flex] [align-items:flex-start] [gap:12px]">
                                    <div className="[margin-top:2px] [display:flex] [height:32px] [width:32px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:8px] [color:#9ca3af] [background:rgba(255,255,255,0.08)]">
                                        📍
                                    </div>
                                    <div>
                                        <p className="[margin:0_0_2px] [font-size:12px] [font-weight:600] [color:#fff]">
                                            Alamat
                                        </p>
                                        <p className="[margin:0] [font-size:12px] [color:#9ca3af]">
                                            Gedung Yotta Signature Perintis, Jl.
                                            Perintis Kemerdekaan No.97 Lantai 3,
                                            Tamalanrea Jaya, Kec. Tamalanrea,
                                            Kota Makassar, Sulawesi Selatan
                                            90245
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="[display:flex] [justify-content:center] [padding-top:24px] [font-size:12px] [color:#6b7280] [border-top:1px_solid_rgba(255,255,255,0.08)]">
                        <p className="[margin:0]">
                            © 2026 Full Bright Indonesia. Lembaga Resmi TOEFL
                            ITP bekerjasama dengan IIEF Jakarta.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Return-to-checkout survey bottom sheet */}
            {rpOpen ? (
                <>
                    <div
                        className="[position:fixed] [inset:0] [z-index:100] [display:flex] [animation:fbFadeInUp_0.2s_ease] [align-items:flex-end] [justify-content:center] [background:rgba(21,21,21,0.45)]"
                        onClick={closeReturnPopup}
                    >
                        <div
                            className="[position:relative] [max-height:60vh] [width:100%] [max-width:480px] [animation:fbSheetUp_0.25s_ease] [overflow-y:auto] [border-radius:24px_24px_0_0] [padding:22px_22px_28px] [box-shadow:0_-12px_40px_rgba(0,0,0,0.18)] [background:#fff]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeReturnPopup}
                                aria-label="Tutup"
                                className="[position:absolute] [top:16px] [right:16px] [display:flex] [height:30px] [width:30px] [cursor:pointer] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:16px] [color:#6b7280] [background:#F3F4F6] [border:none]"
                            >
                                ✕
                            </button>
                            <p className="[margin:0_0_6px] [font-size:11px] [font-weight:700] [letter-spacing:0.06em] [color:#6b6b6b] [text-transform:uppercase]">
                                Sebelum Kamu Pergi
                            </p>
                            <h3 className="[margin:0_0_18px] [padding-right:30px] [font-family:Nunito,sans-serif] [font-size:clamp(22px,5vw,26px)] [line-height:1.25] [font-weight:800] [color:#151515]">
                                Apa yang{' '}
                                <span className="[color:#D70808]">
                                    Masih Bikin Kamu Ragu Daftar?
                                </span>
                            </h3>
                            {rpSelected !== null ? (
                                <>
                                    <TrackedCTA
                                        zone="pricing"
                                        action="whatsapp"
                                        label="Konsultasi Keraguan via WhatsApp"
                                        href={waUrl(
                                            RETURN_WA_MSGS[rpSelected ?? 0],
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="[margin-bottom:14px] [box-sizing:border-box] [display:flex] [width:100%] [align-items:center] [justify-content:center] [gap:8px] [border-radius:12px] [padding:13px_16px] [font-size:14px] [font-weight:700] [color:#fff] [background:#16a34a] [text-decoration:none]"
                                    >
                                        💬 Konsultasi via WhatsApp →
                                    </TrackedCTA>
                                    <p className="[margin:0_0_2px] [font-size:13px] [font-weight:700] [color:#151515]">
                                        {RETURN_SUBTEXTS[rpSelected ?? 0]}
                                    </p>
                                    <p className="[margin:0_0_12px] [font-size:12px] [font-weight:500] [color:#6b7280]">
                                        Tim kami siap bantu jawab langsung lewat
                                        WhatsApp.
                                    </p>
                                    <div className="[box-sizing:border-box] [display:flex] [min-height:54px] [width:100%] [align-items:center] [gap:10px] [border-radius:12px] [padding:12px_14px] [background:rgba(215,8,8,0.05)] [border:1px_solid_#D70808]">
                                        <span className="[display:flex] [height:18px] [width:18px] [flex-shrink:0] [align-items:center] [justify-content:center] [border-radius:9999px] [font-size:10px] [font-weight:800] [color:#fff] [background:#D70808]">
                                            ✓
                                        </span>
                                        <span className="[flex:1] [text-align:left] [font-size:14px] [font-weight:500] [color:#151515]">
                                            {RETURN_OPTIONS[rpSelected ?? 0]}
                                        </span>
                                    </div>
                                </>
                            ) : null}
                            {rpSelected === null ? (
                                <>
                                    <div className="[display:flex] [flex-direction:column] [gap:8px]">
                                        <button
                                            onClick={() => setRpSelected(0)}
                                            style={css(rpOptStyle())}
                                        >
                                            <span className="[flex:1] [text-align:left] [font-size:14px] [font-weight:500] [color:#151515]">
                                                Harganya masih terlalu mahal
                                                buatku
                                            </span>
                                        </button>

                                        <button
                                            onClick={() => setRpSelected(1)}
                                            style={css(rpOptStyle())}
                                        >
                                            <span className="[flex:1] [text-align:left] [font-size:14px] [font-weight:500] [color:#151515]">
                                                Belum yakin bisa mencapai target
                                                TOEFL-ku
                                            </span>
                                        </button>

                                        <button
                                            onClick={() => setRpSelected(2)}
                                            style={css(rpOptStyle())}
                                        >
                                            <span className="[flex:1] [text-align:left] [font-size:14px] [font-weight:500] [color:#151515]">
                                                Belum yakin program ini cocok
                                                untuk kebutuhanku
                                            </span>
                                        </button>

                                        <button
                                            onClick={() => setRpSelected(3)}
                                            style={css(rpOptStyle())}
                                        >
                                            <span className="[flex:1] [text-align:left] [font-size:14px] [font-weight:500] [color:#151515]">
                                                Masih membandingkan dengan
                                                program lain
                                            </span>
                                        </button>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </>
            ) : null}

            {/* Floating WhatsApp */}
            <div className="[position:fixed] [right:48px] [bottom:80px] [z-index:52] [display:flex] [flex-direction:column] [align-items:flex-end] [gap:10px] max-[500px]:[right:16px] max-[500px]:[bottom:72px]">
                {waBubbleOpen ? (
                    <>
                        <div className="[position:relative] [max-width:270px] [border-radius:18px_18px_6px_18px] [padding:14px_16px_14px_14px] [box-shadow:0_10px_34px_rgba(0,0,0,0.18)] [background:#fff] [border:1px_solid_#e5e7eb] max-[559px]:[max-width:208px] max-[559px]:[border-radius:14px_14px_5px_14px] max-[559px]:[padding:10px_12px_10px_11px]">
                            <button
                                onClick={dismissWaBubble}
                                aria-label="Tutup"
                                className="[position:absolute] [top:-9px] [right:-9px] [display:flex] [height:24px] [width:24px] [cursor:pointer] [align-items:center] [justify-content:center] [border-radius:9999px] [padding:0] [font-size:12px] [line-height:1] [font-weight:900] [color:#fff] [background:#151515] [border:2px_solid_#fff]"
                            >
                                ✕
                            </button>
                            <TrackedCTA
                                zone="floating"
                                action="whatsapp"
                                label="Balas Admin WhatsApp"
                                href="https://wa.me/6285255499299?text=Halo%20Admin%20Full%20Bright%20Indonesia.%20Saya%20lihat%20iklan.%20Submission%20beasiswa%20luar%20negeri%20saya%20butuh%20skor%20TOEFL%2C%20saya%20minat%20daftar%20kelas."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="[display:flex] [align-items:flex-start] [gap:11px] [text-decoration:none]"
                            >
                                <img
                                    src="/assets/admin-avatar.jpg"
                                    alt="Admin Full Bright"
                                    className="[height:38px] [width:38px] [flex-shrink:0] [border-radius:9999px] [object-fit:cover] [border:2px_solid_#25D366] max-[559px]:[height:28px] max-[559px]:[width:28px]"
                                />
                                <span className="[display:block]">
                                    <span className="[margin-bottom:3px] [display:block] [font-family:Nunito,sans-serif] [font-size:12px] [font-weight:900] [color:#151515] max-[559px]:[margin-bottom:2px] max-[559px]:[font-size:10px]">
                                        Ms. Fini - Admin Full Bright
                                    </span>
                                    <span className="[display:block] [font-size:13px] [line-height:1.5] [font-weight:600] [color:#3d3d3d]">
                                        Masih bingung atau ragu? Tanya langsung
                                        ke saya di WA ☕
                                    </span>
                                    <span className="[margin-top:8px] [display:inline-block] [font-size:12px] [font-weight:900] [color:#16a34a]">
                                        Balas sekarang →
                                    </span>
                                </span>
                            </TrackedCTA>
                        </div>
                    </>
                ) : null}
                <TrackedCTA
                    zone="floating"
                    action="whatsapp"
                    label="Floating WhatsApp"
                    href="https://wa.me/6285255499299?text=Halo%20Admin%20Full%20Bright%20Indonesia.%20Saya%20lihat%20iklan.%20Submission%20beasiswa%20luar%20negeri%20saya%20butuh%20skor%20TOEFL%2C%20saya%20minat%20daftar%20kelas."
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat WhatsApp"
                    className="[position:relative] [display:flex] [height:58px] [width:58px] [align-items:center] [justify-content:center] [overflow:visible] [border-radius:9999px] [box-shadow:0_6px_22px_rgba(37,211,102,0.5)] [background:#25D366]"
                >
                    <span className="[display:flex] [align-items:center] [justify-content:center]">
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="white"
                        >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path>
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.553 4.103 1.522 5.833L0 24l6.302-1.499A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.887 0-3.656-.494-5.192-1.358l-.373-.213-3.741.89.934-3.629-.243-.384A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path>
                        </svg>
                    </span>
                </TrackedCTA>
            </div>
        </>
    );
}
