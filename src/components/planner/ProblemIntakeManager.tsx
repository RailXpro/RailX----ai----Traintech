import React, { useState } from 'react';
import {
  LifeBuoy,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Plus,
  Filter,
  Truck,
  PhoneCall,
  Search,
  Radio,
  Sparkles,
  MapPin,
  Train,
  Check,
  Zap,
  Volume2
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';
import { ProblemReport, ProblemSeverity, ProblemStatus } from '../../types/railway';
import { playEmergencyAlertSound } from '../../utils/audioAlert';

export const ProblemIntakeManager: React.FC = () => {
  const {
    problemReports,
    updateProblemStatus,
    resolveProblemReport,
    setIsProblemModalOpen,
    selectedDivision
  } = useRailway();
  const { language } = useLanguage();

  const [severityFilter, setSeverityFilter] = useState<'ALL' | ProblemSeverity | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeReports = problemReports.filter(r => r.status !== 'RESOLVED');
  const criticalCount = problemReports.filter(r => r.severity === 'CRITICAL_SOS' && r.status !== 'RESOLVED').length;
  const highCount = problemReports.filter(r => r.severity === 'HIGH' && r.status !== 'RESOLVED').length;
  const resolvedCount = problemReports.filter(r => r.status === 'RESOLVED').length;

  const filteredReports = problemReports.filter(r => {
    if (selectedDivision !== 'All' && r.division && r.division !== selectedDivision) {
      return false;
    }
    if (severityFilter === 'RESOLVED') {
      if (r.status !== 'RESOLVED') return false;
    } else if (severityFilter !== 'ALL') {
      if (r.severity !== severityFilter || r.status === 'RESOLVED') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        (r.stationOrSection && r.stationOrSection.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleDispatchGang = (id: string) => {
    updateProblemStatus(
      id,
      'DISPATCHED',
      'Tower Wagon & Emergency Engineering Gang dispatched from nearest junction yard.'
    );
  };

  const handleMarkResolved = (id: string) => {
    resolveProblemReport(id, 'Site inspection certified safe. Normal operations resumed.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner & Action Header */}
      <div
        className="bms-card"
        style={{
          padding: '22px',
          borderLeft: '4px solid var(--rx-orange)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'var(--rx-orange-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--rx-orange)'
            }}
          >
            <LifeBuoy size={24} className="pulse-radar" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 className="bms-section-title" style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>
                {language === 'mr' ? 'रेल मदद व जन तक्रार निवारण कन्सोल' : 'RailMadad & Community Grievance Radar'}
              </h2>
              <span className="badge badge-clear" style={{ fontSize: '0.68rem' }}>
                AI TRIAGE LIVE
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {language === 'mr'
                ? 'प्रवासी, मोटरमन व क्षेत्रीय कर्मचाऱ्यांनी नोंदवलेल्या समस्यांचे रिअल-टाइम निवारण'
                : 'Real-time passenger, loco-pilot, and trackman problem intake with automatic severity triage and field dispatch'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => playEmergencyAlertSound()}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', color: 'var(--rx-red)' }}
          >
            <Volume2 size={15} color="var(--rx-red)" />
            {language === 'mr' ? 'सायरेन' : 'Siren'}
          </button>

          <button
            onClick={() => setIsProblemModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.85rem' }}
          >
            <Plus size={16} />
            {language === 'mr' ? '+ नवीन समस्या नोंदवा' : '+ Report Problem / SOS'}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <div className="bms-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--rx-orange-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rx-orange)' }}>
            <LifeBuoy size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>Active Tickets</span>
            <strong style={{ fontSize: '1.25rem', color: 'var(--rx-orange)' }}>{activeReports.length}</strong>
          </div>
        </div>

        <div className="bms-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--rx-red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rx-red)' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>Critical SOS</span>
            <strong style={{ fontSize: '1.25rem', color: 'var(--rx-red)' }}>{criticalCount}</strong>
          </div>
        </div>

        <div className="bms-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--rx-amber-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rx-amber)' }}>
            <Clock size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>High Priority</span>
            <strong style={{ fontSize: '1.25rem', color: 'var(--rx-amber)' }}>{highCount}</strong>
          </div>
        </div>

        <div className="bms-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--rx-green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rx-green)' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block' }}>Resolved Today</span>
            <strong style={{ fontSize: '1.25rem', color: 'var(--rx-green)' }}>{resolvedCount}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="bms-card"
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Active' },
            { id: 'CRITICAL_SOS', label: 'Critical SOS' },
            { id: 'HIGH', label: 'High' },
            { id: 'MEDIUM', label: 'Medium' },
            { id: 'LOW', label: 'Low' },
            { id: 'RESOLVED', label: 'Resolved' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSeverityFilter(f.id as any)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-light)',
                background: severityFilter === f.id ? 'var(--rx-orange)' : 'var(--rx-surface-alt)',
                color: severityFilter === f.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search problems by ID or text..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 10px 7px 32px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-light)',
              background: 'var(--rx-surface)',
              color: 'var(--text-dark)',
              fontSize: '0.8rem'
            }}
          />
        </div>
      </div>

      {/* Problem Reports List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredReports.map(report => {
          const isResolved = report.status === 'RESOLVED';
          const isDispatched = report.status === 'DISPATCHED';
          const isCritical = report.severity === 'CRITICAL_SOS';

          return (
            <div
              key={report.id}
              className="bms-card"
              style={{
                padding: '20px',
                borderLeft: `4px solid ${
                  isResolved
                    ? 'var(--rx-green)'
                    : isCritical
                    ? 'var(--rx-red)'
                    : report.severity === 'HIGH'
                    ? 'var(--rx-orange)'
                    : 'var(--rx-blue)'
                }`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--rx-orange)' }}>
                      {report.id}
                    </span>
                    <span className="badge" style={{ fontSize: '0.68rem' }}>
                      {report.division || 'Mumbai CR'}
                    </span>
                    {report.trainNumber && (
                      <span className="badge badge-clear" style={{ fontSize: '0.68rem' }}>
                        Train #{report.trainNumber}
                      </span>
                    )}
                    <span
                      style={{
                        fontSize: '0.68rem',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        fontWeight: 800,
                        background: isResolved ? 'var(--rx-green-light)' : isCritical ? 'var(--rx-red-light)' : 'var(--rx-orange-light)',
                        color: isResolved ? 'var(--rx-green)' : isCritical ? 'var(--rx-red)' : 'var(--rx-orange)'
                      }}
                    >
                      {report.severity.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                    {report.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!isResolved && (
                    <>
                      <button
                        onClick={() => handleDispatchGang(report.id)}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                      >
                        <Truck size={14} color="var(--rx-orange)" />
                        Dispatch Gang
                      </button>
                      <button
                        onClick={() => handleMarkResolved(report.id)}
                        className="btn btn-primary"
                        style={{
                          fontSize: '0.78rem',
                          padding: '6px 14px',
                          background: 'var(--rx-green)'
                        }}
                      >
                        <Check size={14} />
                        Mark Resolved
                      </button>
                    </>
                  )}
                  {isResolved && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--rx-green)', fontSize: '0.8rem', fontWeight: 700 }}>
                      <CheckCircle2 size={16} /> Resolved
                    </span>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.5 }}>
                {report.description}
              </p>

              {/* Footer Meta Strip */}
              <div
                style={{
                  padding: '10px 14px',
                  background: 'var(--rx-surface-alt)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  fontSize: '0.76rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Location: </span>
                    <strong style={{ color: 'var(--text-dark)' }}>{report.stationOrSection}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Reporter: </span>
                    <strong style={{ color: 'var(--text-dark)' }}>{report.reporterName} ({report.reporterContact})</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>AI Score: </span>
                    <strong style={{ color: 'var(--rx-green)' }}>{report.aiPriorityScore}/100</strong>
                  </div>
                </div>

                <div style={{ color: 'var(--text-muted)' }}>
                  {report.timestamp}
                </div>
              </div>

              {report.actionTaken && (
                <div style={{ marginTop: '8px', fontSize: '0.76rem', color: 'var(--rx-green)', fontWeight: 600 }}>
                  ⚡ Current Status: {report.actionTaken}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
