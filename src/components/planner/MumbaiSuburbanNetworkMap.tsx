import React, { useState, useRef, useMemo } from 'react';
import {
  ZoomIn, ZoomOut, Maximize2, RotateCcw, Search,
  Filter, Layers, Train, AlertTriangle, ShieldCheck,
  Zap, Info, MapPin, Compass, ArrowRight, X, Clock, ExternalLink
} from 'lucide-react';
import { useRailway } from '../../context/RailwayContext';
import { useLanguage } from '../../context/LanguageContext';

/* ── Route Line Definitions & Color Palette ────────────────────────────── */
export interface RouteLine {
  id: string;
  name: string;
  nameMr: string;
  color: string;
  pattern?: 'solid' | 'dashed' | 'dotted';
  corridor: string;
}

export const ROUTE_LINES: RouteLine[] = [
  { id: 'wr_fast', name: 'Western (Churchgate - Dahanu Fast)', nameMr: 'पश्चिम जलद (चर्चगेट - डहाणू)', color: '#EF4444', pattern: 'dashed', corridor: 'Western' },
  { id: 'wr_slow', name: 'Western (Churchgate - Borivali Slow)', nameMr: 'पश्चिम धीमा (चर्चगेट - बोरिवली)', color: '#F97316', pattern: 'solid', corridor: 'Western' },
  { id: 'cr_fast', name: 'Central (CSMT - Kasara / Khopoli Fast)', nameMr: 'मध्य जलद (सीएसएमटी - कसारा/खोपोली)', color: '#16A34A', pattern: 'dashed', corridor: 'Central' },
  { id: 'cr_slow', name: 'Central (CSMT - Kalyan Slow)', nameMr: 'मध्य धीमा (सीएसएमटी - कल्याण)', color: '#22C55E', pattern: 'solid', corridor: 'Central' },
  { id: 'hr_main', name: 'Harbour (CSMT - Panvel / Andheri)', nameMr: 'हार्बर (सीएसएमटी - पनवेल/अंधेरी)', color: '#2563EB', pattern: 'solid', corridor: 'Harbour' },
  { id: 'trans_hr', name: 'Trans-Harbour (Thane - Vashi / Panvel)', nameMr: 'ट्रान्स-हार्बर (ठाणे - वाशी/पनवेल)', color: '#06B6D4', pattern: 'solid', corridor: 'Trans-Harbour' },
  { id: 'vasai_diva', name: 'Vasai Road - Diva - Panvel Cord', nameMr: 'वसई रोड - दिवा - पनवेल कॉर्ड', color: '#D946EF', pattern: 'solid', corridor: 'Cord' },
  { id: 'uran_line', name: 'Nerul / Belapur - Uran (Port Line)', nameMr: 'नेरुळ - उरण पोर्ट लाईन', color: '#EAB308', pattern: 'dashed', corridor: 'Uran' },
  { id: 'metro_line1', name: 'MRTS Metro Line 1 (Versova - Ghatkopar)', nameMr: 'मेट्रो लाईन १ (वर्सोव्हा - घाटकोपर)', color: '#A855F7', pattern: 'dotted', corridor: 'Metro' },
];

/* ── Station Coordinates & Network Topology ─────────────────────────────── */
export interface StationNode {
  id: string;
  code: string;
  name: string;
  nameMr: string;
  x: number;
  y: number;
  isInterchange?: boolean;
  isTerminal?: boolean;
  lines: string[];
  platforms?: number;
  zone?: 'CR' | 'WR';
}

export const STATIONS: StationNode[] = [
  // ── Western Line Mainline ─────────────────────────────────────────────
  { id: 'dahanu', code: 'DRD', name: 'Dahanu Road', nameMr: 'डहाणू रोड', x: 180, y: 50, isTerminal: true, lines: ['wr_fast'], zone: 'WR', platforms: 4 },
  { id: 'vangaon', code: 'VGN', name: 'Vangaon', nameMr: 'वाणगाव', x: 180, y: 72, lines: ['wr_fast'], zone: 'WR' },
  { id: 'boisar', code: 'BOR', name: 'Boisar', nameMr: 'बोईसर', x: 180, y: 94, lines: ['wr_fast'], zone: 'WR' },
  { id: 'umroli', code: 'UOI', name: 'Umroli', nameMr: 'उमरोळी', x: 180, y: 114, lines: ['wr_fast'], zone: 'WR' },
  { id: 'palghar', code: 'PLG', name: 'Palghar', nameMr: 'पालघर', x: 180, y: 136, lines: ['wr_fast'], zone: 'WR' },
  { id: 'saphale', code: 'SAH', name: 'Saphale', nameMr: 'सफाळे', x: 180, y: 158, lines: ['wr_fast'], zone: 'WR' },
  { id: 'vaitarna', code: 'VTN', name: 'Vaitarna', nameMr: 'वैतरणा', x: 180, y: 180, lines: ['wr_fast'], zone: 'WR' },
  { id: 'virar', code: 'VR', name: 'Virar', nameMr: 'विरार', x: 180, y: 205, isInterchange: true, isTerminal: true, lines: ['wr_fast', 'wr_slow'], zone: 'WR', platforms: 8 },
  { id: 'nalasopara', code: 'NSP', name: 'Nala Sopara', nameMr: 'नालासोपारा', x: 180, y: 226, lines: ['wr_fast', 'wr_slow'], zone: 'WR' },
  { id: 'vasai_rd', code: 'BSR', name: 'Vasai Road', nameMr: 'वसई रोड', x: 180, y: 250, isInterchange: true, isTerminal: true, lines: ['wr_fast', 'wr_slow', 'vasai_diva'], zone: 'WR', platforms: 7 },
  { id: 'naigaon', code: 'NIG', name: 'Naigaon', nameMr: 'नायगाव', x: 180, y: 272, lines: ['wr_slow'], zone: 'WR' },
  { id: 'bhayander', code: 'BYR', name: 'Bhayander', nameMr: 'भाईंदर', x: 180, y: 295, isInterchange: true, lines: ['wr_fast', 'wr_slow'], zone: 'WR', platforms: 6 },
  { id: 'mira_rd', code: 'MIRA', name: 'Mira Road', nameMr: 'मीरा रोड', x: 180, y: 318, lines: ['wr_slow'], zone: 'WR' },
  { id: 'dahisar', code: 'DIC', name: 'Dahisar', nameMr: 'दहिसर', x: 180, y: 338, lines: ['wr_slow'], zone: 'WR' },
  { id: 'borivali', code: 'BVI', name: 'Borivali', nameMr: 'बोरिवली', x: 180, y: 365, isInterchange: true, isTerminal: true, lines: ['wr_fast', 'wr_slow'], zone: 'WR', platforms: 10 },
  { id: 'kandivali', code: 'KILE', name: 'Kandivali', nameMr: 'कांदिवली', x: 180, y: 390, lines: ['wr_slow'], zone: 'WR' },
  { id: 'malad', code: 'MDD', name: 'Malad', nameMr: 'मालाड', x: 180, y: 412, lines: ['wr_slow'], zone: 'WR' },
  { id: 'goregaon', code: 'GMN', name: 'Goregaon', nameMr: 'गोरेगाव', x: 180, y: 435, isInterchange: true, lines: ['wr_fast', 'wr_slow', 'hr_main'], zone: 'WR', platforms: 7 },
  { id: 'jogeshwari', code: 'JOS', name: 'Jogeshwari', nameMr: 'जोगेश्वरी', x: 180, y: 458, lines: ['wr_slow', 'hr_main'], zone: 'WR' },
  { id: 'andheri', code: 'ADH', name: 'Andheri', nameMr: 'अंधेरी', x: 180, y: 485, isInterchange: true, isTerminal: true, lines: ['wr_fast', 'wr_slow', 'hr_main', 'metro_line1'], zone: 'WR', platforms: 9 },
  { id: 'vile_parle', code: 'VLP', name: 'Vile Parle', nameMr: 'विलेपार्ले', x: 180, y: 512, lines: ['wr_slow', 'hr_main'], zone: 'WR' },
  { id: 'santacruz', code: 'STC', name: 'Santacruz', nameMr: 'सांताक्रूझ', x: 180, y: 532, lines: ['wr_slow', 'hr_main'], zone: 'WR' },
  { id: 'khar_rd', code: 'KHAR', name: 'Khar Road', nameMr: 'खार रोड', x: 180, y: 552, lines: ['wr_slow', 'hr_main'], zone: 'WR' },
  { id: 'bandra', code: 'BA', name: 'Bandra', nameMr: 'वांद्रे', x: 180, y: 575, isInterchange: true, isTerminal: true, lines: ['wr_fast', 'wr_slow', 'hr_main'], zone: 'WR', platforms: 7 },
  { id: 'mahim', code: 'MM', name: 'Mahim Junction', nameMr: 'माहिम जंक्शन', x: 180, y: 605, isInterchange: true, lines: ['wr_slow', 'hr_main'], zone: 'WR', platforms: 6 },
  { id: 'matunga_rd', code: 'MRU', name: 'Matunga Road', nameMr: 'माटुंगा रोड', x: 180, y: 642, lines: ['wr_slow'], zone: 'WR' },
  { id: 'dadar_w', code: 'DDR', name: 'Dadar W', nameMr: 'दादर पश्चिम', x: 180, y: 680, isInterchange: true, isTerminal: true, lines: ['wr_fast', 'wr_slow'], zone: 'WR', platforms: 7 },
  { id: 'elphinstone', code: 'EPR', name: 'Prabhadevi (Elphinstone)', nameMr: 'प्रभादेवी', x: 140, y: 720, lines: ['wr_slow'], zone: 'WR' },
  { id: 'lower_parel', code: 'PL', name: 'Lower Parel', nameMr: 'लोअर परळ', x: 140, y: 745, lines: ['wr_slow'], zone: 'WR' },
  { id: 'mahalaxmi', code: 'MX', name: 'Mahalaxmi', nameMr: 'महालक्ष्मी', x: 140, y: 770, lines: ['wr_slow'], zone: 'WR' },
  { id: 'mumbai_central', code: 'MMCT', name: 'Mumbai Central', nameMr: 'मुंबई सेंट्रल', x: 140, y: 795, isInterchange: true, isTerminal: true, lines: ['wr_fast', 'wr_slow'], zone: 'WR', platforms: 9 },
  { id: 'grant_rd', code: 'GTR', name: 'Grant Road', nameMr: 'ग्रँट रोड', x: 140, y: 825, lines: ['wr_slow'], zone: 'WR' },
  { id: 'charni_rd', code: 'CYR', name: 'Charni Road', nameMr: 'चर्नी रोड', x: 140, y: 850, lines: ['wr_slow'], zone: 'WR' },
  { id: 'marine_lines', code: 'MEL', name: 'Marine Lines', nameMr: 'मरीन लाईन्स', x: 140, y: 875, lines: ['wr_slow'], zone: 'WR' },
  { id: 'churchgate', code: 'CCG', name: 'Churchgate', nameMr: 'चर्चगेट', x: 140, y: 905, isTerminal: true, isInterchange: true, lines: ['wr_fast', 'wr_slow'], zone: 'WR', platforms: 4 },

  // ── Central Line Mainline ─────────────────────────────────────────────
  { id: 'kasara', code: 'KSRA', name: 'Kasara', nameMr: 'कसारा', x: 890, y: 250, isTerminal: true, isInterchange: true, lines: ['cr_fast'], zone: 'CR', platforms: 4 },
  { id: 'khardi', code: 'KE', name: 'Khardi', nameMr: 'खर्डी', x: 855, y: 275, lines: ['cr_fast'], zone: 'CR' },
  { id: 'asangaon', code: 'ASO', name: 'Asangaon', nameMr: 'आसनगाव', x: 820, y: 300, isTerminal: true, lines: ['cr_fast'], zone: 'CR' },
  { id: 'vasind', code: 'VSD', name: 'Vasind', nameMr: 'वासिंद', x: 790, y: 322, lines: ['cr_fast'], zone: 'CR' },
  { id: 'khadavali', code: 'KDV', name: 'Khadavali', nameMr: 'खडावली', x: 760, y: 345, lines: ['cr_fast'], zone: 'CR' },
  { id: 'titwala', code: 'TLA', name: 'Titwala', nameMr: 'टिटवाळा', x: 730, y: 368, isTerminal: true, lines: ['cr_fast'], zone: 'CR' },
  { id: 'ambivli', code: 'ABY', name: 'Ambivli', nameMr: 'आंबिवली', x: 700, y: 390, lines: ['cr_fast'], zone: 'CR' },
  { id: 'shahad', code: 'SHAD', name: 'Shahad', nameMr: 'शहाड', x: 675, y: 410, lines: ['cr_fast'], zone: 'CR' },

  { id: 'kalyan', code: 'KYN', name: 'Kalyan Junction', nameMr: 'कल्याण जंक्शन', x: 650, y: 435, isInterchange: true, isTerminal: true, lines: ['cr_fast', 'cr_slow'], zone: 'CR', platforms: 8 },
  { id: 'thakurli', code: 'THK', name: 'Thakurli', nameMr: 'ठाकुर्ली', x: 615, y: 435, lines: ['cr_slow'], zone: 'CR' },
  { id: 'dombivli', code: 'DI', name: 'Dombivli', nameMr: 'डोंबिवली', x: 580, y: 435, isInterchange: true, isTerminal: true, lines: ['cr_fast', 'cr_slow'], zone: 'CR', platforms: 5 },
  { id: 'diva', code: 'DIVA', name: 'Diva Junction', nameMr: 'दिवा जंक्शन', x: 540, y: 435, isInterchange: true, isTerminal: true, lines: ['cr_fast', 'cr_slow', 'vasai_diva'], zone: 'CR', platforms: 8 },
  { id: 'mumbra', code: 'MBQ', name: 'Mumbra', nameMr: 'मुंब्रा', x: 500, y: 435, lines: ['cr_slow'], zone: 'CR' },
  { id: 'kalwa', code: 'KLVA', name: 'Kalwa', nameMr: 'कळवा', x: 470, y: 435, lines: ['cr_slow'], zone: 'CR' },
  { id: 'thane', code: 'TNA', name: 'Thane', nameMr: 'ठाणे', x: 440, y: 445, isInterchange: true, isTerminal: true, lines: ['cr_fast', 'cr_slow', 'trans_hr'], zone: 'CR', platforms: 10 },

  { id: 'mulund', code: 'MLND', name: 'Mulund', nameMr: 'मुलुंड', x: 415, y: 475, lines: ['cr_fast', 'cr_slow'], zone: 'CR' },
  { id: 'nahur', code: 'NHU', name: 'Nahur', nameMr: 'नाहूर', x: 395, y: 495, lines: ['cr_slow'], zone: 'CR' },
  { id: 'bhandup', code: 'BND', name: 'Bhandup', nameMr: 'भांडुप', x: 375, y: 515, lines: ['cr_fast', 'cr_slow'], zone: 'CR' },
  { id: 'kanjurmarg', code: 'KJRD', name: 'Kanjur Marg', nameMr: 'कांजूरमार्ग', x: 355, y: 535, lines: ['cr_slow'], zone: 'CR' },
  { id: 'vikhroli', code: 'VK', name: 'Vikhroli', nameMr: 'विक्रोळी', x: 335, y: 555, lines: ['cr_fast', 'cr_slow'], zone: 'CR' },
  { id: 'ghatkopar', code: 'GC', name: 'Ghatkopar', nameMr: 'घाटकोपर', x: 310, y: 580, isInterchange: true, lines: ['cr_fast', 'cr_slow', 'metro_line1'], zone: 'CR', platforms: 4 },
  { id: 'vidyavihar', code: 'VVH', name: 'Vidyavihar', nameMr: 'विद्याविहार', x: 285, y: 605, lines: ['cr_slow'], zone: 'CR' },
  { id: 'kurla', code: 'CLA', name: 'Kurla Junction', nameMr: 'कुर्ला जंक्शन', x: 260, y: 630, isInterchange: true, isTerminal: true, lines: ['cr_fast', 'cr_slow', 'hr_main'], zone: 'CR', platforms: 8 },
  { id: 'sion', code: 'SIN', name: 'Sion', nameMr: 'शीव', x: 235, y: 655, lines: ['cr_slow'], zone: 'CR' },
  { id: 'matunga_cr', code: 'MTN', name: 'Matunga CR', nameMr: 'माटुंगा मध्य', x: 215, y: 675, lines: ['cr_slow'], zone: 'CR' },
  { id: 'dadar_c', code: 'DR', name: 'Dadar CR', nameMr: 'दादर मध्य', x: 200, y: 700, isInterchange: true, isTerminal: true, lines: ['cr_fast', 'cr_slow'], zone: 'CR', platforms: 8 },
  { id: 'parel', code: 'PR', name: 'Parel', nameMr: 'परळ', x: 200, y: 730, lines: ['cr_slow'], zone: 'CR' },
  { id: 'currey_rd', code: 'CRD', name: 'Currey Road', nameMr: 'करी रोड', x: 200, y: 755, lines: ['cr_slow'], zone: 'CR' },
  { id: 'chinchpokli', code: 'CHG', name: 'Chinchpokli', nameMr: 'चिंचपोकळी', x: 200, y: 780, lines: ['cr_slow'], zone: 'CR' },
  { id: 'byculla', code: 'BY', name: 'Byculla', nameMr: 'भायखळा', x: 200, y: 810, isInterchange: true, lines: ['cr_fast', 'cr_slow'], zone: 'CR', platforms: 4 },
  { id: 'sandhurst_rd', code: 'SNRD', name: 'Sandhurst Road', nameMr: 'सँडहर्स्ट रोड', x: 200, y: 845, isInterchange: true, lines: ['cr_slow', 'hr_main'], zone: 'CR', platforms: 4 },
  { id: 'masjid', code: 'MSD', name: 'Masjid', nameMr: 'मशीद', x: 200, y: 875, lines: ['cr_slow', 'hr_main'], zone: 'CR' },
  { id: 'csmt', code: 'CSMT', name: 'Mumbai CSMT', nameMr: 'छत्रपती शिवाजी महाराज टर्मिनस', x: 200, y: 905, isTerminal: true, isInterchange: true, lines: ['cr_fast', 'cr_slow', 'hr_main'], zone: 'CR', platforms: 18 },

  // ── Central SE Branch (Karjat & Khopoli) ──────────────────────────────
  { id: 'vithalwadi', code: 'VLDI', name: 'Vithalwadi', nameMr: 'विठ्ठलवाडी', x: 675, y: 465, lines: ['cr_fast', 'cr_slow'], zone: 'CR' },
  { id: 'ulhasnagar', code: 'ULNR', name: 'Ulhasnagar', nameMr: 'उल्हासनगर', x: 700, y: 490, lines: ['cr_fast', 'cr_slow'], zone: 'CR' },
  { id: 'ambernath', code: 'ABH', name: 'Ambernath', nameMr: 'अंबरनाथ', x: 730, y: 520, isTerminal: true, lines: ['cr_fast', 'cr_slow'], zone: 'CR' },
  { id: 'badlapur', code: 'BUD', name: 'Badlapur', nameMr: 'बदलापूर', x: 760, y: 560, isTerminal: true, lines: ['cr_fast', 'cr_slow'], zone: 'CR' },
  { id: 'vangani', code: 'VGI', name: 'Vangani', nameMr: 'वांगणी', x: 760, y: 595, lines: ['cr_fast'], zone: 'CR' },
  { id: 'shelu', code: 'SHLU', name: 'Shelu', nameMr: 'शेलू', x: 760, y: 630, lines: ['cr_fast'], zone: 'CR' },
  { id: 'neral', code: 'NRL', name: 'Neral Junction (Matheran)', nameMr: 'नेरळ जंक्शन', x: 760, y: 665, isInterchange: true, lines: ['cr_fast'], zone: 'CR' },
  { id: 'bhivpuri', code: 'BVS', name: 'Bhivpuri Road', nameMr: 'भिवपुरी रोड', x: 760, y: 705, lines: ['cr_fast'], zone: 'CR' },
  { id: 'karjat', code: 'KJT', name: 'Karjat Junction', nameMr: 'कर्जत जंक्शन', x: 760, y: 745, isTerminal: true, isInterchange: true, lines: ['cr_fast'], zone: 'CR', platforms: 5 },
  { id: 'palasdari', code: 'PDI', name: 'Palasdari', nameMr: 'पळसदरी', x: 740, y: 780, lines: ['cr_fast'], zone: 'CR' },
  { id: 'kelavli', code: 'KLY', name: 'Kelavli', nameMr: 'केळवली', x: 720, y: 810, lines: ['cr_fast'], zone: 'CR' },
  { id: 'dolavli', code: 'DLV', name: 'Dolavli', nameMr: 'डोळवली', x: 700, y: 835, lines: ['cr_fast'], zone: 'CR' },
  { id: 'lowjee', code: 'LWJ', name: 'Lowjee', nameMr: 'लवजी', x: 680, y: 860, lines: ['cr_fast'], zone: 'CR' },
  { id: 'khopoli', code: 'KHPI', name: 'Khopoli', nameMr: 'खोपोली', x: 660, y: 885, isTerminal: true, lines: ['cr_fast'], zone: 'CR', platforms: 2 },

  // ── Harbour Line ──────────────────────────────────────────────────────
  { id: 'dockyard', code: 'DKRD', name: 'Dockyard Road', nameMr: 'डॉकयार्ड रोड', x: 235, y: 800, lines: ['hr_main'], zone: 'CR' },
  { id: 'reay_rd', code: 'RRD', name: 'Reay Road', nameMr: 'रे रोड', x: 235, y: 775, lines: ['hr_main'], zone: 'CR' },
  { id: 'cotton_green', code: 'CTGN', name: 'Cotton Green', nameMr: 'कॉटन ग्रीन', x: 235, y: 750, lines: ['hr_main'], zone: 'CR' },
  { id: 'sewri', code: 'SVE', name: 'Sewri', nameMr: 'शिवडी', x: 235, y: 720, lines: ['hr_main'], zone: 'CR' },
  { id: 'wadala_rd', code: 'VDLR', name: 'Wadala Road', nameMr: 'वडाळा रोड', x: 235, y: 685, isInterchange: true, isTerminal: true, lines: ['hr_main'], zone: 'CR', platforms: 4 },
  { id: 'gtb_nagar', code: 'GTBN', name: 'GTB Nagar', nameMr: 'जीटीबी नगर', x: 245, y: 645, lines: ['hr_main'], zone: 'CR' },
  { id: 'chunabhatti', code: 'CHF', name: 'Chunabhatti', nameMr: 'चुनाभट्टी', x: 255, y: 620, lines: ['hr_main'], zone: 'CR' },
  { id: 'tilak_nagar', code: 'TKNG', name: 'Tilak Nagar', nameMr: 'टिळक नगर', x: 295, y: 610, lines: ['hr_main'], zone: 'CR' },
  { id: 'chembur', code: 'CMBR', name: 'Chembur', nameMr: 'चेंबर', x: 325, y: 595, isInterchange: true, lines: ['hr_main'], zone: 'CR' },
  { id: 'govandi', code: 'GV', name: 'Govandi', nameMr: 'गोवंडी', x: 355, y: 580, lines: ['hr_main'], zone: 'CR' },
  { id: 'mankhurd', code: 'MNKD', name: 'Mankhurd', nameMr: 'मानखुर्द', x: 385, y: 565, lines: ['hr_main'], zone: 'CR' },

  { id: 'vashi', code: 'VSH', name: 'Vashi', nameMr: 'वाशी', x: 430, y: 565, isInterchange: true, isTerminal: true, lines: ['hr_main', 'trans_hr'], zone: 'CR', platforms: 4 },
  { id: 'sanpada', code: 'SNPD', name: 'Sanpada', nameMr: 'सानपाडा', x: 455, y: 590, isInterchange: true, lines: ['hr_main', 'trans_hr'], zone: 'CR' },
  { id: 'juinagar', code: 'JNJ', name: 'Juinagar', nameMr: 'जुईनगर', x: 475, y: 615, isInterchange: true, lines: ['hr_main', 'trans_hr'], zone: 'CR' },
  { id: 'nerul', code: 'NEU', name: 'Nerul', nameMr: 'नेरूळ', x: 485, y: 645, isInterchange: true, isTerminal: true, lines: ['hr_main', 'trans_hr', 'uran_line'], zone: 'CR', platforms: 6 },
  { id: 'seawoods', code: 'SWDV', name: 'Seawoods-Darave', nameMr: 'सीवूड्स-दारावे', x: 495, y: 675, isInterchange: true, lines: ['hr_main', 'uran_line'], zone: 'CR' },
  { id: 'belapur', code: 'BEPR', name: 'Belapur CBD', nameMr: 'सीबीडी बेलापूर', x: 515, y: 700, isInterchange: true, isTerminal: true, lines: ['hr_main', 'uran_line'], zone: 'CR', platforms: 4 },
  { id: 'kharghar', code: 'KHAG', name: 'Kharghar', nameMr: 'खारघर', x: 540, y: 725, lines: ['hr_main'], zone: 'CR' },
  { id: 'mansarovar', code: 'MANR', name: 'Mansarovar', nameMr: 'मानसरोवर', x: 565, y: 745, lines: ['hr_main'], zone: 'CR' },
  { id: 'khandeshwar', code: 'KNDS', name: 'Khandeshwar', nameMr: 'खांदेश्वर', x: 590, y: 765, lines: ['hr_main'], zone: 'CR' },
  { id: 'panvel', code: 'PNVL', name: 'Panvel Junction', nameMr: 'पनवेल जंक्शन', x: 620, y: 780, isTerminal: true, isInterchange: true, lines: ['hr_main', 'trans_hr', 'vasai_diva'], zone: 'CR', platforms: 7 },

  // ── Trans-Harbour Line Stations ───────────────────────────────────────
  { id: 'airoli', code: 'AIRL', name: 'Airoli', nameMr: 'ऐरोली', x: 450, y: 475, lines: ['trans_hr'], zone: 'CR' },
  { id: 'rabale', code: 'RABE', name: 'Rabale', nameMr: 'रबाळे', x: 450, y: 500, lines: ['trans_hr'], zone: 'CR' },
  { id: 'ghansoli', code: 'GNSL', name: 'Ghansoli', nameMr: 'घणसोली', x: 450, y: 520, lines: ['trans_hr'], zone: 'CR' },
  { id: 'koparkhairane', code: 'KPHN', name: 'Kopar Khairane', nameMr: 'कोपरखैरणे', x: 450, y: 540, lines: ['trans_hr'], zone: 'CR' },
  { id: 'turbhe', code: 'TRB', name: 'Turbhe', nameMr: 'तुर्भे', x: 450, y: 565, isInterchange: true, lines: ['trans_hr'], zone: 'CR' },

  // ── Vasai Road - Diva - Panvel Cord ───────────────────────────────────
  { id: 'juchandra', code: 'JCNR', name: 'Juchandra', nameMr: 'जुचंद्र', x: 235, y: 250, lines: ['vasai_diva'], zone: 'WR' },
  { id: 'kaman_rd', code: 'KARD', name: 'Kaman Road', nameMr: 'कामन रोड', x: 310, y: 250, lines: ['vasai_diva'], zone: 'WR' },
  { id: 'kharbhao', code: 'KBV', name: 'Kharbhao', nameMr: 'खारबाव', x: 395, y: 260, lines: ['vasai_diva'], zone: 'CR' },
  { id: 'bhiwandi', code: 'BIRD', name: 'Bhiwandi Road', nameMr: 'भिवंडी रोड', x: 475, y: 345, lines: ['vasai_diva'], zone: 'CR' },
  { id: 'datiwali', code: 'DTWL', name: 'Datiwali', nameMr: 'दातिवली', x: 540, y: 480, lines: ['vasai_diva'], zone: 'CR' },
  { id: 'nilaje', code: 'NIIJ', name: 'Nilaje', nameMr: 'निळाजे', x: 545, y: 535, lines: ['vasai_diva'], zone: 'CR' },
  { id: 'taloja', code: 'TPND', name: 'Taloja Panchanand', nameMr: 'तळोजा', x: 565, y: 580, lines: ['vasai_diva'], zone: 'CR' },
  { id: 'navade_rd', code: 'NVRD', name: 'Navade Road', nameMr: 'नावडे रोड', x: 585, y: 640, lines: ['vasai_diva'], zone: 'CR' },
  { id: 'kalamboli', code: 'KLMG', name: 'Kalamboli', nameMr: 'कळंबोली', x: 605, y: 710, lines: ['vasai_diva'], zone: 'CR' },

  // ── Uran Port Line ────────────────────────────────────────────────────
  { id: 'sagar_sangam', code: 'SGSM', name: 'Sagar Sangam', nameMr: 'सागर संगम', x: 460, y: 720, lines: ['uran_line'], zone: 'CR' },
  { id: 'targhar', code: 'TRGR', name: 'Targhar', nameMr: 'तरघर', x: 480, y: 760, lines: ['uran_line'], zone: 'CR' },
  { id: 'bamandongri', code: 'BMDR', name: 'Bamandongri', nameMr: 'बामणडोंगरी', x: 490, y: 800, lines: ['uran_line'], zone: 'CR' },
  { id: 'kharkopar', code: 'KARP', name: 'Kharkopar', nameMr: 'खारकोपर', x: 490, y: 840, lines: ['uran_line'], zone: 'CR' },
  { id: 'uran', code: 'URAN', name: 'Uran', nameMr: 'उरण', x: 380, y: 890, isTerminal: true, lines: ['uran_line'], zone: 'CR', platforms: 4 },

  // ── Metro Line 1 (Versova - Ghatkopar) ─────────────────────────────────
  { id: 'versova', code: 'VER', name: 'Versova Metro', nameMr: 'वर्सोव्हा', x: 50, y: 440, isTerminal: true, lines: ['metro_line1'] },
  { id: 'dn_nagar', code: 'DNN', name: 'DN Nagar', nameMr: 'डीएन नगर', x: 90, y: 440, lines: ['metro_line1'] },
  { id: 'chakala', code: 'CKL', name: 'Chakala (J.B. Nagar)', nameMr: 'चकाला', x: 220, y: 475, lines: ['metro_line1'] },
  { id: 'airport_rd', code: 'APRD', name: 'Airport Road', nameMr: 'एअरपोर्ट रोड', x: 240, y: 495, lines: ['metro_line1'] },
  { id: 'marol_naka', code: 'MRNL', name: 'Marol Naka', nameMr: 'मरोळ नाका', x: 260, y: 515, lines: ['metro_line1'] },
  { id: 'saki_naka', code: 'SKNK', name: 'Saki Naka', nameMr: 'साकीनाका', x: 280, y: 535, lines: ['metro_line1'] },
];

export const MumbaiSuburbanNetworkMap: React.FC = () => {
  const { trackSections, megaBlocks, accidents, trains, openTripPlanner } = useRailway();
  const { language, t } = useLanguage();

  const [selectedStation, setSelectedStation] = useState<StationNode | null>(null);
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Search filter
  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) return STATIONS;
    const q = searchQuery.toLowerCase().trim();
    return STATIONS.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.nameMr.includes(q) ||
      s.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeMegaBlockStationIds = useMemo(() => {
    const ids = new Set<string>();
    megaBlocks.filter(b => b.status === 'active' || b.status === 'scheduled').forEach(b => {
      STATIONS.forEach(s => {
        if (b.sectionName.toLowerCase().includes(s.name.toLowerCase())) {
          ids.add(s.id);
        }
      });
    });
    return ids;
  }, [megaBlocks]);

  const activeAccidentStationIds = useMemo(() => {
    const ids = new Set<string>();
    accidents.filter(a => a.status !== 'resolved').forEach(a => {
      STATIONS.forEach(s => {
        if (a.trainName.toLowerCase().includes(s.name.toLowerCase()) || a.sectionName.toLowerCase().includes(s.name.toLowerCase())) {
          ids.add(s.id);
        }
      });
    });
    return ids;
  }, [accidents]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="bms-card" style={{
      background: 'var(--rx-surface)',
      borderRadius: '24px',
      padding: '20px',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-card)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ── Top Header Controls ────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '16px',
        paddingBottom: '14px',
        borderBottom: '1px solid var(--border-light)'
      }}>
        {/* Title & Badge */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--rx-green) 0%, var(--rx-green-mid) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px var(--rx-green-glow)'
            }}>
              <Compass size={20} color="#FFFFFF" />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--text-dark)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}>
                {language === 'mr' ? 'मुंबई उपनगरीय रेल्वे मार्ग नकाशा' : 'Mumbai Suburban Rail Network Map'}
              </h2>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--rx-green-deep)', letterSpacing: '0.04em' }}>
                WESTERN • CENTRAL • HARBOUR • TRANS-HARBOUR • VASAI-DIVA • URAN PORT
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-control"
              placeholder={language === 'mr' ? 'स्थानक शोधा...' : 'Search station / code...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '0.78rem', height: '34px' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Zoom & Reset Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--rx-surface-alt)', borderRadius: 'var(--radius-pill)', padding: '3px', border: '1px solid var(--border-light)' }}>
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.4))}
              title="Zoom In"
              style={{
                width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                background: 'transparent', color: 'var(--text-dark)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <ZoomIn size={15} />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.6))}
              title="Zoom Out"
              style={{
                width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                background: 'transparent', color: 'var(--text-dark)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={resetView}
              title="Reset Map"
              style={{
                width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                background: 'transparent', color: 'var(--text-dark)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Route Line Filter Pills ────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '10px',
        marginBottom: '10px'
      }}>
        <button
          onClick={() => setSelectedLine('all')}
          style={{
            padding: '5px 12px',
            borderRadius: 'var(--radius-pill)',
            border: selectedLine === 'all' ? '1px solid var(--rx-green)' : '1px solid var(--border-light)',
            background: selectedLine === 'all' ? 'var(--rx-green)' : 'var(--rx-surface-alt)',
            color: selectedLine === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          All Corridors (सर्व मार्ग)
        </button>

        {ROUTE_LINES.map(line => (
          <button
            key={line.id}
            onClick={() => setSelectedLine(line.id)}
            style={{
              padding: '5px 12px',
              borderRadius: 'var(--radius-pill)',
              border: selectedLine === line.id ? `2px solid ${line.color}` : '1px solid var(--border-light)',
              background: selectedLine === line.id ? `${line.color}18` : 'var(--rx-surface-alt)',
              color: selectedLine === line.id ? line.color : 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: line.color, display: 'inline-block'
            }} />
            <span>{language === 'mr' ? line.nameMr : line.name}</span>
          </button>
        ))}
      </div>

      {/* ── Interactive SVG Map Canvas ─────────────────────────────────── */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          width: '100%',
          height: '620px',
          background: '#F0F9FF',
          borderRadius: '18px',
          border: '1px solid var(--border-medium)',
          position: 'relative',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
      >
        <svg
          viewBox="0 0 1020 960"
          style={{
            width: '100%',
            height: '100%',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
            transformOrigin: '50% 50%',
            transition: isDragging ? 'none' : 'transform 0.15s ease'
          }}
        >
          <defs>
            {/* Ambient Water Gradient */}
            <linearGradient id="arabianSea" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.4" />
            </linearGradient>

            {/* Landmass Fill */}
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* ── Arabian Sea & Creeks Background ────────────────────────── */}
          <rect width="1020" height="960" fill="#E0F2FE" />

          {/* Mumbai Coastline Peninsula Landmass */}
          <path
            d="M 40,0 
               L 420,0 
               Q 440,120 460,240 
               L 520,240 
               Q 510,340 480,440 
               L 520,440 
               Q 540,560 500,640 
               L 470,680 
               Q 460,780 480,880 
               L 480,960 
               L 100,960 
               L 110,880 
               Q 110,720 150,600 
               Q 150,500 120,440 
               L 40,440 
               Z"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="2"
            opacity="0.9"
          />

          {/* Thane Creek & Navi Mumbai Coastline */}
          <path
            d="M 470,240 
               Q 480,380 440,480 
               Q 410,540 380,590 
               L 420,660 
               Q 460,760 480,880 
               L 520,880 
               Q 500,740 460,660 
               Q 470,580 500,480 
               Z"
            fill="#BAE6FD"
            opacity="0.6"
          />

          {/* ── Network Track Lines ────────────────────────────────────── */}
          <g>
            {/* 1. Western Line (Churchgate to Dahanu Road) */}
            {(selectedLine === 'all' || selectedLine === 'wr_fast') && (
              <path
                d="M 140,905 L 140,795 L 180,680 L 180,365 L 180,205 L 180,50"
                fill="none"
                stroke="#EF4444"
                strokeWidth="5"
                strokeDasharray="8,5"
                strokeLinecap="round"
              />
            )}

            {(selectedLine === 'all' || selectedLine === 'wr_slow') && (
              <path
                d="M 140,905 L 140,795 L 180,680 L 180,365"
                fill="none"
                stroke="#F97316"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            )}

            {/* 2. Central Main Line (CSMT to Kasara & Khopoli) */}
            {(selectedLine === 'all' || selectedLine === 'cr_slow') && (
              <path
                d="M 200,905 L 200,700 Q 200,640 260,630 L 310,580 L 440,445 L 540,435 L 650,435"
                fill="none"
                stroke="#22C55E"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            )}

            {(selectedLine === 'all' || selectedLine === 'cr_fast') && (
              <g>
                <path
                  d="M 200,905 L 200,700 Q 200,640 260,630 L 310,580 L 440,445 L 540,435 L 650,435"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="5"
                  strokeDasharray="8,5"
                  strokeLinecap="round"
                />
                {/* NE Kasara Branch */}
                <path
                  d="M 650,435 L 890,250"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="5"
                  strokeDasharray="8,5"
                  strokeLinecap="round"
                />
                {/* SE Karjat & Khopoli Branch */}
                <path
                  d="M 650,435 L 760,560 L 760,745 L 660,885"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="5"
                  strokeDasharray="8,5"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* 3. Harbour Line (CSMT to Panvel & Andheri Branch) */}
            {(selectedLine === 'all' || selectedLine === 'hr_main') && (
              <g>
                {/* Main Harbour (CSMT -> Panvel) */}
                <path
                  d="M 200,905 Q 235,880 235,685 L 260,630 L 385,565 L 430,565 Q 485,590 485,645 L 515,700 Q 565,745 620,780"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
                {/* Andheri Branch (Wadala -> Mahim -> Bandra -> Andheri -> Goregaon) */}
                <path
                  d="M 235,685 L 180,605 L 180,435"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="4"
                  strokeDasharray="6,4"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* 4. Trans-Harbour Line (Thane -> Vashi / Panvel) */}
            {(selectedLine === 'all' || selectedLine === 'trans_hr') && (
              <path
                d="M 440,445 L 450,565 L 455,590 L 485,645 L 620,780"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            )}

            {/* 5. Vasai Road - Diva - Panvel Cord */}
            {(selectedLine === 'all' || selectedLine === 'vasai_diva') && (
              <path
                d="M 180,250 L 395,260 L 540,435 L 545,535 L 620,780"
                fill="none"
                stroke="#D946EF"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            )}

            {/* 6. Nerul - Uran Port Line */}
            {(selectedLine === 'all' || selectedLine === 'uran_line') && (
              <path
                d="M 485,645 L 495,675 L 460,720 L 490,840 L 380,890"
                fill="none"
                stroke="#EAB308"
                strokeWidth="4.5"
                strokeDasharray="6,4"
                strokeLinecap="round"
              />
            )}

            {/* 7. Metro Line 1 (Versova - Ghatkopar) */}
            {(selectedLine === 'all' || selectedLine === 'metro_line1') && (
              <path
                d="M 50,440 L 180,485 L 260,515 L 310,580"
                fill="none"
                stroke="#A855F7"
                strokeWidth="4"
                strokeDasharray="4,4"
                strokeLinecap="round"
              />
            )}
          </g>

          {/* ── Major Landmark Labels (Airport, Terminals) ──────────────── */}
          <g>
            {/* Chhatrapati Shivaji Maharaj International Airport */}
            <rect x="200" y="525" width="76" height="28" rx="8" fill="#1E3A8A" />
            <text x="238" y="543" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle">
              ✈️ BOM AIRPORT
            </text>
          </g>

          {/* ── Station Nodes & Interchanges ────────────────────────────── */}
          <g>
            {filteredStations.map(st => {
              const isSelected = selectedStation?.id === st.id;
              const hasBlock = activeMegaBlockStationIds.has(st.id);
              const hasAccident = activeAccidentStationIds.has(st.id);

              return (
                <g
                  key={st.id}
                  onClick={() => setSelectedStation(st)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Interchange Outer Capsule */}
                  {st.isInterchange ? (
                    <g>
                      <circle
                        cx={st.x} cy={st.y}
                        r={isSelected ? 11 : 9}
                        fill="#FFFFFF"
                        stroke="#0F172A"
                        strokeWidth="3"
                        filter="url(#shadow)"
                      />
                      <circle
                        cx={st.x} cy={st.y}
                        r="4"
                        fill={hasAccident ? '#EF4444' : (hasBlock ? '#F59E0B' : '#0F172A')}
                      />
                    </g>
                  ) : (
                    <circle
                      cx={st.x} cy={st.y}
                      r={isSelected ? 6 : 4}
                      fill={hasAccident ? '#EF4444' : (hasBlock ? '#F59E0B' : '#FFFFFF')}
                      stroke="#0F172A"
                      strokeWidth="1.8"
                    />
                  )}

                  {/* Terminal Code Pill */}
                  {st.code && (st.isTerminal || st.isInterchange) && (
                    <g transform={`translate(${st.x + 12}, ${st.y - 12})`}>
                      <rect
                        x="-3" y="-9"
                        width={st.code.length * 7 + 8}
                        height="14"
                        rx="4"
                        fill="#0F172A"
                      />
                      <text
                        x={st.code.length * 3.5 + 1}
                        y="1"
                        fill="#FFFFFF"
                        fontSize="8.5"
                        fontWeight="900"
                        textAnchor="middle"
                      >
                        {st.code}
                      </text>
                    </g>
                  )}

                  {/* Station Name Label */}
                  <text
                    x={st.x + (st.isInterchange ? 14 : 10)}
                    y={st.y + 4}
                    fill={isSelected ? '#059669' : '#1E293B'}
                    fontSize={st.isInterchange ? '11' : '9.5'}
                    fontWeight={st.isInterchange ? '900' : '600'}
                    fontFamily="var(--font-sans)"
                  >
                    {language === 'mr' ? st.nameMr : st.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* ── Station Quick Inspector Popover ──────────────────────────── */}
        {selectedStation && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            maxWidth: '340px',
            width: 'calc(100% - 40px)',
            background: 'var(--rx-surface)',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: 'var(--shadow-modal)',
            border: '1.5px solid var(--rx-green)',
            animation: 'authFadeIn 0.2s ease',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 'var(--radius-pill)',
                    background: 'var(--rx-header)', color: '#fff', fontSize: '0.7rem', fontWeight: 800
                  }}>
                    {selectedStation.code}
                  </span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--rx-green-deep)' }}>
                    {selectedStation.zone || 'CR/WR'} • {selectedStation.platforms || 4} Platforms
                  </span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-dark)', marginTop: '2px', fontFamily: 'var(--font-display)' }}>
                  {language === 'mr' ? selectedStation.nameMr : selectedStation.name}
                </div>
              </div>

              <button
                onClick={() => setSelectedStation(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Line Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              {selectedStation.lines.map(lineId => {
                const lineInfo = ROUTE_LINES.find(l => l.id === lineId);
                return (
                  <span
                    key={lineId}
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: `${lineInfo?.color || '#059669'}18`,
                      color: lineInfo?.color || '#059669',
                      border: `1px solid ${lineInfo?.color || '#059669'}40`
                    }}
                  >
                    {lineInfo?.corridor || lineId}
                  </span>
                );
              })}
            </div>

            {/* Action CTA */}
            <button
              onClick={() => {
                openTripPlanner(selectedStation.name);
                setSelectedStation(null);
              }}
              className="btn btn-green"
              style={{ width: '100%', padding: '8px', fontSize: '0.78rem', fontWeight: 800 }}
            >
              <span>{language === 'mr' ? 'या स्थानकावरून प्रवास नियोजन' : 'Plan Trip from this Station'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── Legend Bar ─────────────────────────────────────────────────── */}
      <div style={{
        marginTop: '14px',
        padding: '12px 16px',
        background: 'var(--rx-surface-alt)',
        borderRadius: '12px',
        border: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.72rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2.5px solid #0F172A', background: '#FFFFFF', display: 'inline-block' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Interchange Station</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', background: '#EF4444', display: 'inline-block' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Western Line</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', background: '#16A34A', display: 'inline-block' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Central Line</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', background: '#2563EB', display: 'inline-block' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Harbour Line</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', background: '#06B6D4', display: 'inline-block' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Trans-Harbour</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '3px', background: '#D946EF', display: 'inline-block' }} />
            <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>Vasai-Diva Cord</span>
          </div>
        </div>

        <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
          💡 Drag to Pan • Scroll / Buttons to Zoom • Tap any Station to inspect
        </div>
      </div>
    </div>
  );
};
