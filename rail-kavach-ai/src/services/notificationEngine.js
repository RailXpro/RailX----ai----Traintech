import { TRAINS } from '../data/trains';
import { SAMPLE_PNRS } from '../data/samplePNRs';
import { TRACK_SECTIONS, STATIONS } from '../data/railwayNetwork';
import { defaultRouteSolver } from './routeSolver';

// Smart Notification Generator & Route Interception Dispatcher
export class NotificationEngine {
  // Generate Exact Accident Alert for Passengers on Disrupted Route
  static createAccidentAlertForPassenger(passenger, accident, aiDetour) {
    const train = TRAINS.find(t => t.trainNumber === passenger.trainNumber);
    const stationFrom = STATIONS[accident.fromStation]?.name || accident.fromStation;
    const stationTo = STATIONS[accident.toStation]?.name || accident.toStation;

    const detourSummary = aiDetour && aiDetour.hasDetour
      ? `AI has automatically synthesized a safe alternative detour via ${aiDetour.detourRoute.map(s => STATIONS[s]?.code || s).join(' ➔ ')} (+${aiDetour.extraTimeMins}m ETA).`
      : `Railway control is operating single-line token clearance. Expect delay.`;

    return {
      id: `NOTIF-ACC-${passenger.pnr}-${Date.now()}`,
      pnr: passenger.pnr,
      passengerName: passenger.passengerName,
      trainNumber: passenger.trainNumber,
      trainName: passenger.trainName,
      type: 'ACCIDENT_CORRIDOR_ALERT',
      severity: 'CRITICAL',
      priority: 'HIGH_PRIORITY_PUSH',
      title: `🚨 CRITICAL SAFETY ALERT: Incident on Your Train Route (${passenger.trainNumber})`,
      message: `Attention ${passenger.passengerName}: An incident has occurred on your travel corridor between ${stationFrom} and ${stationTo}.`,
      exactAccidentDetails: {
        incidentType: accident.incidentType,
        incidentTitle: accident.title,
        exactLocation: accident.locationName,
        involvedTrain: accident.involvedTrain ? `Train #${accident.involvedTrain} (${accident.involvedTrainName})` : 'Freight/Maintenance Rake',
        severityLevel: accident.severity,
        officialDescription: accident.description,
        estimatedClearance: `${accident.clearanceEtaHours} Hours`,
        kavachSafetyStatus: accident.kavachStatus || 'ACTIVE_SAFETY_BRAKING_ZONE',
        oheStatus: accident.oheStatus || 'ISOLATED_FOR_SAFETY',
        reportedAt: accident.reportedAt || new Date().toISOString(),
      },
      aiAlternativeRoute: aiDetour && aiDetour.hasDetour ? {
        hasAlternative: true,
        detourPath: aiDetour.detourRoute,
        detourStationNames: aiDetour.detourRoute.map(code => STATIONS[code]?.name || code),
        extraDistanceKm: aiDetour.extraDistanceKm,
        extraTimeMins: aiDetour.extraTimeMins,
        confidence: aiDetour.confidenceScore,
        safetyCert: aiDetour.safetyClearance,
        recommendation: detourSummary,
      } : null,
      actionRequired: 'Review AI Alternative Route or opt for Full Refund / Reschedule via IRCTC RailMadad.',
      helplineContact: '139 (Indian Railways Emergency Control Room)',
      timestamp: new Date().toISOString(),
      isRead: false,
    };
  }

  // Generate Personalized Mega Block Notification for Passengers
  static createMegaBlockAlertForPassenger(passenger, parsedBlock) {
    const extraction = parsedBlock.extraction;
    const linesStr = extraction.affectedLines.join(', ');

    return {
      id: `NOTIF-MB-${passenger.pnr}-${Date.now()}`,
      pnr: passenger.pnr,
      passengerName: passenger.passengerName,
      trainNumber: passenger.trainNumber,
      trainName: passenger.trainName,
      type: 'MEGA_BLOCK_PERSONALIZED_ADVISORY',
      severity: 'MODERATE_WARNING',
      priority: 'ADVISORY',
      title: `⚠️ Advance Notice: Planned Mega Block on Your Journey Route`,
      message: `Dear ${passenger.passengerName}, Indian Railways has scheduled a maintenance Mega Block in ${extraction.division} affecting your travel path.`,
      exactBlockDetails: {
        blockType: extraction.blockType,
        division: extraction.division,
        maintenanceDate: extraction.date,
        timeWindow: extraction.timeWindow,
        linesAffected: linesStr,
        maintenanceNature: extraction.maintenanceType,
        impactSummary: extraction.impactDescription,
      },
      passengerImpact: {
        scheduledDeparture: passenger.scheduledDeparture,
        expectedDelay: '15 - 30 minutes speed regulation',
        platformDiversion: 'Train will operate via designated diverted fast/slow track corridor',
      },
      helplineContact: '139 (RailMadad)',
      timestamp: new Date().toISOString(),
      isRead: false,
    };
  }

  // Intercept All Passengers and Generate Targeted Alerts for an Incident
  static dispatchAccidentAlerts(accident, activeBlocks = []) {
    const alerts = [];
    const affectedPnrs = [];

    SAMPLE_PNRS.forEach(passenger => {
      const train = TRAINS.find(t => t.trainNumber === passenger.trainNumber);
      if (!train) return;

      // Check if this passenger's route traverses the accident section
      const routeCheck = defaultRouteSolver.checkRouteInterception(passenger.routeStations, new Set([accident.sectionId]));

      if (routeCheck.isIntercepted || accident.involvedTrain === passenger.trainNumber) {
        // Calculate AI Detour for this train/passenger
        const aiDetour = defaultRouteSolver.generateSmartDetour(train, [accident], activeBlocks);
        const alert = this.createAccidentAlertForPassenger(passenger, accident, aiDetour);
        alerts.push(alert);
        affectedPnrs.push(passenger.pnr);
      }
    });

    return {
      alerts,
      affectedPnrs,
      dispatchedCount: alerts.length,
    };
  }

  // Intercept All Passengers and Generate Personalized Alerts for a Mega Block Notice
  static dispatchMegaBlockAlerts(parsedBlock) {
    const alerts = [];
    const affectedPnrs = [];

    SAMPLE_PNRS.forEach(passenger => {
      const isTrainImpacted = parsedBlock.extraction.impactedTrains.includes(passenger.trainNumber);
      const isSectionImpacted = passenger.routeStations.some(st => 
        parsedBlock.extraction.affectedSections.some(secId => {
          const sec = TRACK_SECTIONS.find(s => s.id === secId);
          return sec && (sec.from === st || sec.to === st);
        })
      );

      if (isTrainImpacted || isSectionImpacted) {
        const alert = this.createMegaBlockAlertForPassenger(passenger, parsedBlock);
        alerts.push(alert);
        affectedPnrs.push(passenger.pnr);
      }
    });

    return {
      alerts,
      affectedPnrs,
      dispatchedCount: alerts.length,
    };
  }
}
