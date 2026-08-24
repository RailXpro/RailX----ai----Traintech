import React, { useState } from 'react';
import {
  Train, ShieldCheck, UserCheck, Zap,
  ArrowRight, Sparkles, Building2, MapPin,
  Lock, Mail, KeyRound, Compass, PhoneCall, ChevronRight, User
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { DivisionName, OfficialDesignation, UserRole } from '../../types/railway';

/* ─── Google SVG Icon ─────────────────────────────────────────────────── */
const GoogleIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const DIVISIONS: DivisionName[] = [
  'Mumbai CR', 'Mumbai WR', 'Delhi NR', 'Howrah ER', 'Chennai SR', 'Bengaluru SWR'
];

export const SignInGateway: React.FC = () => {
  const { loginWithGoogle } = useRailway();
  const { language, setLanguage, t } = useLanguage();

  const [role, setRole] = useState<'official' | 'passenger'>('official');
  const [identifier, setIdentifier] = useState<string>('controller.mumbai@railnet.gov.in');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [division, setDivision] = useState<DivisionName>('Mumbai CR');
  const [fullName, setFullName] = useState<string>('Er. Rajesh Kumar Sharma');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const isOfficial = role === 'official';
      loginWithGoogle(isOfficial ? 'official' : 'consumer', {
        name: fullName || (isOfficial ? 'Railway Traffic Controller' : 'TrainX Commuter'),
        email: identifier || (isOfficial ? 'controller@railnet.gov.in' : 'user@trainx.in'),
        division: division,
        officialDesignation: isOfficial ? 'Chief Train Controller (DOM)' : undefined,
        employeeId: isOfficial ? `IR-${division.slice(0, 2).toUpperCase()}-948102` : undefined,
        avatarUrl: isOfficial
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'
      });
      setIsLoading(false);
    }, 450);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle(role === 'official' ? 'official' : 'consumer', {
        division: division
      });
      setIsLoading(false);
    }, 500);
  };

  const handleQuickDemo = () => {
    loginWithGoogle('official', {
      name: 'Er. Rajesh Kumar Sharma',
      email: 'controller.mumbai@railnet.gov.in',
      officialDesignation: 'Chief Train Controller (DOM)',
      employeeId: 'IR-CRIS-884920',
      division: 'Mumbai CR'
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--rx-cream)',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Top Brand Bar */}
      <header style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1100px',
        width: '100%',
        margin: '0 auto',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--rx-green) 0%, var(--rx-green-mid) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px var(--rx-green-glow)'
          }}>
            <Train size={22} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span className="font-display" style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-dark)', letterSpacing: '-0.03em' }}>
                Train<span style={{ color: 'var(--rx-green)' }}>X</span>
              </span>
            </div>
            <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--rx-green-deep)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              भारतीय रेल • Indian Railways
            </div>
          </div>
        </div>

        {/* Right header controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Language Switcher */}
          <div className="lang-toggle" style={{ background: 'var(--rx-surface-alt)', border: '1px solid var(--border-light)' }}>
            <button
              onClick={() => setLanguage('en')}
              className={`lang-toggle-btn ${language === 'en' ? 'active' : ''}`}
              style={language === 'en' ? { background: 'var(--rx-green)', color: '#fff' } : { color: 'var(--text-secondary)' }}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('mr')}
              className={`lang-toggle-btn ${language === 'mr' ? 'active' : ''}`}
              style={language === 'mr' ? { background: 'var(--rx-green)', color: '#fff' } : { color: 'var(--text-secondary)' }}
            >
              मराठी
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px 40px',
        maxWidth: '1020px',
        width: '100%',
        margin: '0 auto',
        zIndex: 1
      }}>
        <div style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'stretch'
        }}>
          {/* Left Column: Hero Context */}
          <div className="bms-card" style={{
            padding: '30px 26px',
            background: 'linear-gradient(145deg, #0C1322 0%, #111C33 100%)',
            color: '#FFFFFF',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: 'var(--shadow-header)'
          }}>
            <div>
              {/* Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                background: 'rgba(16, 185, 129, 0.16)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: 'var(--radius-pill)',
                color: '#34D399',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                marginBottom: '16px'
              }}>
                <Sparkles size={13} />
                <span>INTELLIGENT BLOCK & TRAFFIC SUITE</span>
              </div>

              <h1 style={{
                fontSize: '1.65rem',
                fontWeight: 900,
                lineHeight: 1.25,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                marginBottom: '12px',
                fontFamily: 'var(--font-display)'
              }}>
                {language === 'mr'
                  ? 'भारतीय रेल्वे स्वयंचलित ब्लॉक नियोजन व आपत्कालीन नियंत्रण मंच'
                  : 'AI Automatic Block Planning & Disruption Management'}
              </h1>

              <p style={{
                fontSize: '0.82rem',
                color: '#94A3B8',
                lineHeight: 1.6,
                marginBottom: '20px'
              }}>
                {language === 'mr'
                  ? 'मेगा ब्लॉक ऑप्टिमायझेशन, रिअल-टाइम ट्रॅक ऑक्युपन्सी, कवच टक्कर-विरोधी सुरक्षा आणि प्रवासी मार्गदर्शनासाठी एकसंध प्रणाली.'
                  : 'Real-time telemetry, automated mega block scheduling, Kavach SIL-4 safety interlocks, and commuter smart rerouting across all divisions.'}
              </p>

              {/* Feature Highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { icon: <ShieldCheck size={16} color="#10B981" />, title: 'Kavach 2.0 Anti-Collision', desc: 'Automatic Signal Danger Tripping & Safety Interlocks' },
                  { icon: <Zap size={16} color="#F59E0B" />, title: 'AI Auto-Block Optimization', desc: 'Zero Conflict Sunday Mega Block Solver & Reroute' },
                  { icon: <Compass size={16} color="#3B82F6" />, title: 'National Rail Grid Radar', desc: 'Mumbai CR, WR, Delhi NR, Howrah ER & South Grid' },
                ].map((f, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: 'rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {f.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F8FAFC' }}>{f.title}</div>
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom status */}
            <div style={{
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem'
            }}>
              <span style={{ color: '#E2E8F0', fontWeight: 700 }}>
                🛡️ CRIS National Telemetry Gateway
              </span>
              <span style={{ color: '#34D399', fontWeight: 800 }}>
                ACTIVE & SYNCED
              </span>
            </div>
          </div>

          {/* Right Column: Clean Credentials Sign In Form */}
          <div className="bms-card" style={{
            padding: '28px 24px',
            background: 'var(--rx-surface)',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '18px'
          }}>
            <div>
              {/* Header */}
              <div style={{ marginBottom: '18px' }}>
                <h2 style={{
                  fontSize: '1.3rem',
                  fontWeight: 900,
                  color: 'var(--text-dark)',
                  letterSpacing: '-0.02em',
                  marginBottom: '4px',
                  fontFamily: 'var(--font-display)'
                }}>
                  {language === 'mr' ? 'प्रवेश करा (Sign In)' : 'Sign In to TrainX'}
                </h2>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  {language === 'mr'
                    ? 'रेल्वे नियोजन किंवा प्रवासी पोर्टलसाठी आपली माहिती प्रविष्ट करा:'
                    : 'Enter your credentials to access the Railway Operations or Commuter Portal:'}
                </p>
              </div>

              {/* Persona Tab Switcher */}
              <div style={{
                display: 'flex',
                background: 'var(--rx-surface-alt)',
                borderRadius: '12px',
                padding: '4px',
                marginBottom: '16px',
                border: '1px solid var(--border-light)'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setRole('official');
                    setIdentifier('controller.mumbai@railnet.gov.in');
                    setFullName('Er. Rajesh Kumar Sharma');
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: role === 'official' ? 'var(--rx-green)' : 'transparent',
                    color: role === 'official' ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.18s ease',
                    boxShadow: role === 'official' ? '0 2px 8px var(--rx-green-glow)' : 'none'
                  }}
                >
                  <Building2 size={14} />
                  <span>{language === 'mr' ? 'रेल्वे अधिकारी' : 'Railway Official'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('passenger');
                    setIdentifier('passenger@trainx.in');
                    setFullName('Rohit Sharma');
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: role === 'passenger' ? 'var(--rx-orange)' : 'transparent',
                    color: role === 'passenger' ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.18s ease',
                    boxShadow: role === 'passenger' ? '0 2px 8px var(--rx-orange-glow)' : 'none'
                  }}
                >
                  <UserCheck size={14} />
                  <span>{language === 'mr' ? 'दैनिक प्रवासी' : 'Passenger Portal'}</span>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                    {language === 'mr' ? 'नाव' : 'Full Name'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      className="input-control"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Er. Rajesh Kumar Sharma"
                      style={{ paddingLeft: '34px' }}
                      required
                    />
                  </div>
                </div>

                {/* Email / ID */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                    {role === 'official' ? 'RailNet Official Email / Employee ID' : 'Email Address / Mobile Number'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      className="input-control"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={role === 'official' ? 'controller@railnet.gov.in' : 'name@example.com'}
                      style={{ paddingLeft: '34px' }}
                      required
                    />
                  </div>
                </div>

                {/* Division Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                    {language === 'mr' ? 'रेल्वे विभाग' : 'Assigned Railway Division'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <select
                      className="input-control"
                      value={division}
                      onChange={(e) => setDivision(e.target.value as DivisionName)}
                      style={{ paddingLeft: '34px' }}
                    >
                      {DIVISIONS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password / PIN */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '4px' }}>
                    {role === 'official' ? 'RailNet Security PIN / Password' : 'Password / OTP PIN'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      className="input-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      style={{ paddingLeft: '34px' }}
                      required
                    />
                  </div>
                </div>

                {/* Submit Primary Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={role === 'official' ? 'btn btn-green' : 'btn btn-primary'}
                  style={{
                    width: '100%',
                    padding: '11px 18px',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    marginTop: '4px',
                    boxShadow: role === 'official' ? '0 4px 14px var(--rx-green-glow)' : '0 4px 14px var(--rx-orange-glow)'
                  }}
                >
                  {isLoading ? 'Authenticating...' : (
                    <>
                      <ShieldCheck size={16} />
                      <span>{role === 'official' ? 'Access Controller Command' : 'Enter Passenger Portal'}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                margin: '14px 0 12px',
                color: 'var(--text-muted)',
                fontSize: '0.7rem'
              }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
                <span>OR</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                style={{
                  width: '100%',
                  padding: '9px 16px',
                  background: 'var(--rx-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--text-dark)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'all 0.16s ease'
                }}
              >
                <GoogleIcon size={16} />
                <span>Sign in with Google / RailNet SSO</span>
              </button>
            </div>

            {/* Quick Demo Access Bar */}
            <div style={{
              borderTop: '1px solid var(--border-light)',
              paddingTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Need instant evaluation?
              </span>

              <button
                type="button"
                onClick={handleQuickDemo}
                style={{
                  background: 'var(--rx-surface-alt)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-dark)',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-pill)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>1-Click Guest Pass</span>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
