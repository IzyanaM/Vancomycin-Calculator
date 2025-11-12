// --- LOOKUP TABLES & CONSTANTS ---
const LD_CRCL_BELOW_30 = [
    { maxWeight: 49.9, dose: 1000 }, { maxWeight: 59.9, dose: 1250 },
    { maxWeight: 79.9, dose: 1500 }, { maxWeight: 89.9, dose: 1750 },
    { maxWeight: Infinity, dose: 2000 }
];
const LD_CRCL_ABOVE_30 = [
    { maxWeight: 49.9, dose: 1000 }, { maxWeight: 59.9, dose: 1250 },
    { maxWeight: 69.9, dose: 1500 }, { maxWeight: 79.9, dose: 1750 },
    { maxWeight: Infinity, dose: 2000 }
];
const LD_HD_BEFORE = [
    { maxWeight: 49.9, dose: 1000, topUp: 250 }, { maxWeight: 59.9, dose: 1000, topUp: 300 },
    { maxWeight: 69.9, dose: 1250, topUp: 350 }, { maxWeight: 79.9, dose: 1250, topUp: 400 },
    { maxWeight: 89.9, dose: 1500, topUp: 450 }, { maxWeight: 99.9, dose: 1500, topUp: 500 },
    { maxWeight: Infinity, dose: 2000, topUp: 500 }
];
const LD_HD_DURING = [
    { maxWeight: 49.9, dose: 1250 }, { maxWeight: 59.9, dose: 1500 },
    { maxWeight: 69.9, dose: 1750 }, { maxWeight: 79.9, dose: 1750 },
    { maxWeight: 89.9, dose: 2000 }, { maxWeight: Infinity, dose: 2000 }
];
const MD_CRCL_15_29 = [
    { minWeight: 40, maxWeight: 74.9, dose: '500 mg OD (6:00 AM)' },
    { minWeight: 75, maxWeight: Infinity, dose: '750 mg OD (6:00 AM)' }
];
const MD_CRCL_30_49 = [
    { minWeight: 40, maxWeight: 49.9, dose: '500 mg OD (6:00 AM)' },
    { minWeight: 50, maxWeight: 74.9, dose: '750 mg OD (6:00 AM)' },
    { minWeight: 75, maxWeight: 89.9, dose: '500 mg BD (6:00 AM & 6:00 PM)' },
    { minWeight: 90, maxWeight: Infinity, dose: '750 mg BD (6:00 AM & 6:00 PM)' }
];
const MD_CRCL_50_59 = [
    { minWeight: 40, maxWeight: 59.9, dose: '750 mg OD (6:00 AM)' },
    { minWeight: 60, maxWeight: 74.9, dose: '500 mg BD (6:00 AM & 6:00 PM)' },
    { minWeight: 75, maxWeight: 89.9, dose: '750 mg BD (6:00 AM & 6:00 PM)' },
    { minWeight: 90, maxWeight: Infinity, dose: '1,000 mg BD (6:00 AM & 6:00 PM)' }
];
const MD_CRCL_ABOVE_60 = [
    { minWeight: 40, maxWeight: 49.9, dose: '500 mg BD (6:00 AM & 6:00 PM)' },
    { minWeight: 50, maxWeight: 59.9, dose: '750 mg BD (6:00 AM & 6:00 PM)' },
    { minWeight: 60, maxWeight: 74.9, dose: '1,000 mg BD (6:00 AM & 6:00 PM)' },
    { minWeight: 75, maxWeight: 89.9, dose: '750 mg TDS (6:00 AM, 2:00 PM & 10:00 PM)' },
    { minWeight: 90, maxWeight: Infinity, dose: '1,000 mg TDS (6:00 AM, 2:00 PM & 10:00 PM)*' }
];
const ADMIN_CENTRAL = [
    { dose: 500, time: 1, dilution: '50 mL of NS or D5', maxConc: '10 mg/mL' },
    { dose: 750, time: 1.5, dilution: '100 mL of NS or D5', maxConc: '7.5 mg/mL' },
    { dose: 1000, time: 2, dilution: '100 mL of NS or D5', maxConc: '10 mg/mL' },
    { dose: 1250, time: 2.5, dilution: '200 mL of NS or D5', maxConc: '6.25 mg/mL' },
    { dose: 1500, time: 2.5, dilution: '200 mL of NS or D5', maxConc: '7.5 mg/mL' },
    { dose: 1750, time: 3, dilution: '200 mL of NS or D5', maxConc: '8.75 mg/mL' },
    { dose: 2000, time: 4, dilution: '200 mL of NS or D5', maxConc: '10 mg/mL' }
];
const ADMIN_PERIPHERAL = [
    { dose: 500, time: 1, dilution: '100 mL of NS or D5', maxConc: '5 mg/mL' },
    { dose: 750, time: 1.5, dilution: '200 mL of NS or D5', maxConc: '3.75 mg/mL' },
    { dose: 1000, time: 2, dilution: '200 mL of NS or D5', maxConc: '5 mg/mL' },
    { dose: 1250, time: 2.5, dilution: '250 mL of NS or D5', maxConc: '5 mg/mL' },
    { dose: 1500, time: 2.5, dilution: '500 mL of NS or D5', maxConc: '3 mg/mL' },
    { dose: 1750, time: 3, dilution: '500 mL of NS or D5', maxConc: '3.5 mg/mL' },
    { dose: 2000, time: 4, dilution: '500 mL of NS or D5', maxConc: '4 mg/mL' }
];

// **NEW CODE: Add these flag variables here**
let hasScrolledVancomycin = false;
let hasScrolledBW = false;
let hasScrolledCrCl = false;


// --- UTILITY FUNCTIONS ---
function getDose(weight, table) {
    const data = table.find(item => weight < item.maxWeight + 0.1);
    return data ? { dose: data.dose, topUp: data.topUp, roundedDose: Math.round(data.dose / 250) * 250 } : null;
}

function getMaintenanceDose(weight, table) {
    const mdData = table.find(item => weight >= item.minWeight && weight <= (item.maxWeight === Infinity ? Infinity : item.maxWeight));
    if (!mdData) return null;
    
    const parts = mdData.dose.split(' ');
    const dose = parseFloat(parts[0].replace(',', ''));
    const freqText = parts[2].replace('*', '');  // Fixed: parts[2] gets "OD", "BD", "TDS" correctly
    
    return { dose, doseText: parts[0], freqText, fullDoseText: mdData.dose, roundedDose: Math.round(dose / 250) * 250 };
}


function getAdminInstruction(dose, ivAccessType) {
    if (!dose) return null;
    const table = ivAccessType === 'central' ? ADMIN_CENTRAL : ADMIN_PERIPHERAL;
    
    let instruction = table.find(item => item.dose === dose);
    
    if (!instruction) {
         instruction = table.find(item => item.dose > dose);
         if (!instruction) instruction = table[table.length - 1]; 
    }
    
    if (!instruction) return null;

    return {
        ...instruction,
        maxConc: ivAccessType === 'central' ? '10 mg/mL' : '5 mg/mL'
    };
}

function toggleCollapsible(id) {
  const content = document.getElementById(id);
  if (content.style.display === "block") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }
}

function toggleMenu(event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById('dropdownMenu');
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

function openCrClCalculator() {
    window.open('crcl.html', '_blank');
}
function openBwCalculator() {
    window.open('bw.html', '_blank');
}

// --- CALCULATOR CLEAR FUNCTIONS ---
function clearVancomycinInputs() {
  document.getElementById('vancomycinForm').reset();
  document.getElementById('abwWarning').style.display = 'none';
  if (document.getElementById('scr_input')) document.getElementById('scr_input').value = '';
  if (document.getElementById('crclGroup')) document.getElementById('crclGroup').style.display = 'none';
  if (document.getElementById('timingGroup')) document.getElementById('timingGroup').style.display = 'none';
  if (document.getElementById('ivAccessFootnote')) document.getElementById('ivAccessFootnote').style.display = 'none';
  if (document.getElementById('vancomycinOutput')) document.getElementById('vancomycinOutput').style.display = 'none';
  if (document.getElementById('warningCollapse')) document.getElementById('warningCollapse').style.display = 'none';

  // **NEW: Reset scroll flag**
  hasScrolledVancomycin = false;
}

function clearBWInputs() {
  document.getElementById('bwForm').reset();
  if (document.getElementById('bwOutput')) document.getElementById('bwOutput').style.display = 'none';

  // **NEW: Reset scroll flag**
  hasScrolledBW = false;
}

function clearCrClInputs() {
  document.getElementById('crclForm').reset();
  if (document.getElementById('crclOutput')) document.getElementById('crclOutput').style.display = 'none';

  // **NEW: Reset scroll flag**
  hasScrolledCrCl = false;
}


// --- PAGE 4: RENAL FUNCTION (CrCl) CALCULATOR LOGIC ---
function calculateCrCl() {
  const age = parseFloat(document.getElementById('crcl_age').value);
  const bw = parseFloat(document.getElementById('crcl_bw').value);
  const scr = parseFloat(document.getElementById('crcl_scr').value);
  const gender = document.getElementById('crcl_gender').value;
  const outputDiv = document.getElementById('crclOutput');

  if (isNaN(age) || isNaN(bw) || isNaN(scr) || !gender) {
    outputDiv.style.display = 'none';
    return;
  }

  const F = gender === 'male' ? 1.23 : 1.04;
  const crcl = ((140 - age) * bw * F) / scr;

  document.getElementById('result_crcl').textContent = crcl.toFixed(1);
  outputDiv.style.display = 'block';

  // **MODIFIED: Scroll with header offset**
  if (!hasScrolledCrCl) {
    setTimeout(() => {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const outputPosition = outputDiv.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = outputPosition - headerHeight - 20; // 20px extra padding
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      hasScrolledCrCl = true;
    }, 100);
  }
} // **ADD THIS CLOSING BRACE - IT WAS MISSING!**


// --- PAGE 3: BODY WEIGHT (BW) CALCULATOR LOGIC ---
function calculateBW() {
  const abw = parseFloat(document.getElementById('bw_abw').value);
  const heightCm = parseFloat(document.getElementById('bw_height').value);
  const gender = document.getElementById('bw_gender').value;
  const outputDiv = document.getElementById('bwOutput');

  if (isNaN(abw) || isNaN(heightCm)) {
    outputDiv.style.display = 'none';
    return;
  }

  const heightM = heightCm / 100;

  // 1. BMI (kg/m²)
  const bmi = abw / (heightM * heightM);
  document.getElementById('result_bmi').textContent = bmi.toFixed(1);

  // 2. BSA (m²) - Mosteller Formula
  const bsa = Math.sqrt((heightCm * abw) / 3600);
  document.getElementById('result_bsa').textContent = bsa.toFixed(2);

  // 3. IBW (kg) - Devine Formula
  let ibw = NaN;
  let ibwText = 'N/A (Select Gender)';

  if (gender) {
    if (gender === 'male') {
      ibw = 50 + 0.9 * (heightCm - 152);
    } else if (gender === 'female') {
      ibw = 45.5 + 0.9 * (heightCm - 152);
    }
    
    if (ibw < (gender === 'male' ? 50 : 45.5) && heightCm < 152) {
        ibw = (gender === 'male' ? 50 : 45.5) - 0.9 * (152 - heightCm);
    }
    ibwText = ibw.toFixed(1);

  } 
  document.getElementById('result_ibw').textContent = ibwText;


  // 4. AdjBW (kg) - Adjusted Body Weight
  let adjbwValue = '';
  if (!isNaN(ibw) && abw > ibw) {
    // AdjBW = IBW + 0.4 * (Actual Weight - IBW)
    const adjbw = ibw + 0.4 * (abw - ibw);
    adjbwValue = adjbw.toFixed(1); // Only output number
  } else if (!isNaN(ibw)) {
    adjbwValue = 'N/A (Actual Weight \u2264 IBW)';
  } else {
    adjbwValue = 'N/A (Select Gender)';
  }
  document.getElementById('result_adjbw').textContent = adjbwValue;


  outputDiv.style.display = 'block';

  // **MODIFIED: Scroll only when ALL inputs are complete (including gender)**
  if (!hasScrolledBW && gender) {  // Added: && gender
    setTimeout(() => {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const outputPosition = outputDiv.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = outputPosition - headerHeight - 20;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      hasScrolledBW = true;
    }, 100);
  }
}

// --- PAGE 2: VANCOMYCIN CALCULATOR LOGIC ---
function getAdminRegimenText(doseData, ivAccessText, frequencyText) {
    const ldAdmin = getAdminInstruction(doseData.roundedDose, ivAccessText);
    if (!ldAdmin) return null;
    return `${doseData.roundedDose.toLocaleString()} mg IV ${frequencyText}, diluted in ${ldAdmin.dilution}, administered over ${ldAdmin.time} hour${ldAdmin.time > 1 ? 's' : ''}.`;
}

function toggleCrClInput() {
  const status = document.getElementById('dialysisStatus').value;
  const crclGroup = document.getElementById('crclGroup');
  const timingGroup = document.getElementById('timingGroup');

  if (crclGroup) crclGroup.style.display = status === 'notHD' ? 'block' : 'none';
  if (timingGroup) timingGroup.style.display = status === 'HD' ? 'block' : 'none';
  
  // Clear conditional inputs when status changes
  if (document.getElementById('scr_input')) document.getElementById('scr_input').value = '';
  if (document.getElementById('crcl')) document.getElementById('crcl').value = '';
  if (document.getElementById('dialysisTiming')) document.getElementById('dialysisTiming').value = '';
  
  calculateVancomycin();
}

function displayIvAccessFootnote() {
  const access = document.getElementById('ivAccess').value;
  const footnote = document.getElementById('ivAccessFootnote');

  if (footnote) {
      if (access) {
        footnote.style.display = 'block';
        if (access === 'peripheral') {
          footnote.innerHTML = 'Footnote: “Max concentration of Vancomycin: 5 mg/mL”';
        } else if (access === 'central') {
          footnote.innerHTML = 'Footnote: “Max concentration of Vancomycin: 10 mg/mL”';
        }
      } else {
        footnote.style.display = 'none';
      }
  }
  
  calculateVancomycin();
}

function calculateVancomycin() {
  const abw = parseFloat(document.getElementById('abw').value);
  const status = document.getElementById('dialysisStatus').value;
  const scr_input = document.getElementById('scr_input').value;
  const crcl = parseFloat(document.getElementById('crcl').value);
  const timing = document.getElementById('dialysisTiming').value;
  const indication = document.getElementById('indication').value;
  const ivAccess = document.getElementById('ivAccess').value;

  const outputDiv = document.getElementById('vancomycinOutput');
  const abwWarning = document.getElementById('abwWarning');
  
  // --- Initial Validation and Visibility ---
  const inputsComplete = abw > 0 && status && indication && ivAccess && 
                         (status !== 'notHD' || crcl > 0) && (status !== 'HD' || timing);

  if (!inputsComplete) {
    if(outputDiv) outputDiv.style.display = 'none';
    if(abwWarning) abwWarning.style.display = 'none';
    return;
  }
  if(outputDiv) outputDiv.style.display = 'block';

// **MODIFIED: Scroll with header offset - targeting the h3 heading**
if (!hasScrolledVancomycin) {
  setTimeout(() => {
    if(outputDiv) {
      // Find the first h3 heading in the output section
      const firstHeading = outputDiv.querySelector('h3');
      const targetElement = firstHeading || outputDiv;
      
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = targetPosition - headerHeight - 20;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      hasScrolledVancomycin = true;
    }
  }, 100);
}

  if (abw < 40) {
    if(abwWarning) abwWarning.style.display = 'block';
  } else {
    if(abwWarning) abwWarning.style.display = 'none';
  }
  
  // --- Global Variables for Output Steps ---
  let ldData = null;
  let ldText = '';
  let ldTable = null;
  let mdData = null;
  let mdHeader = '';
  let mdText = '';
  let mdTable = null;

  // --- STEP 1: Loading Dose (LD) Calculation ---
  if (document.getElementById('ldFootnoteHD')) document.getElementById('ldFootnoteHD').style.display = 'none';
  let ldAdminRegimenText = 'Loading Dose not calculated.';
  
  if (status === 'notHD') {
    ldTable = (crcl < 30) ? LD_CRCL_BELOW_30 : LD_CRCL_ABOVE_30;
    ldText = (crcl < 30) ? 'Loading dose: 20 mg/kg IV STAT' : 'Loading dose: 20–25 mg/kg IV STAT';
    ldData = getDose(abw, ldTable);
    ldAdminRegimenText = ldData ? getAdminRegimenText(ldData, ivAccess, 'STAT') : 'Loading Dose not calculated.';
  } else if (status === 'HD') {
    if (timing === 'beforeHD') {
      ldTable = LD_HD_BEFORE;
      ldText = 'Loading Dose: 15–20 mg/kg IV STAT';
      if (document.getElementById('ldFootnoteHD')) document.getElementById('ldFootnoteHD').style.display = 'list-item';
    } else if (timing === 'duringHD') {
      ldTable = LD_HD_DURING;
      ldText = 'Loading Dose: 25 mg/kg IV STAT (To be given 1 hour before HD ends.)';
    }
    ldData = getDose(abw, ldTable);
    
    // Issue 2 Fix: Add Top-Up Dose instruction to the clinical note string if applicable
    ldAdminRegimenText = ldData ? getAdminRegimenText(ldData, ivAccess, 'STAT') : 'Loading Dose not calculated.';
    if (ldData && timing === 'beforeHD' && ldData.topUp !== undefined) {
        // Concatenate the two sentences cleanly for the clinical note
        let baseRegimen = getAdminRegimenText(ldData, ivAccess, 'STAT').replace('.', '');
        ldAdminRegimenText = `${baseRegimen} PLUS Top-Up Dose of ${ldData.topUp.toLocaleString()} mg post-HD (if HD is on the same day).`;
    }
  }

  let ldOutputHTML = '';
    if (ldData) {
        // Add colored wrapper for visual consistency
        ldOutputHTML = `<div style="background-color: #F8E8E8; border-left: 4px solid #800000; border-radius: 8px; padding: 20px; margin-bottom: 15px;">`;
        
        // --- TABLE FIRST (Primary Information) ---
        if (ldTable) {
            // CRITICAL: Find the specific item based on ABW to get the correct weight bounds and Top-Up value
            const relevantItem = ldTable.find(item => abw <= item.maxWeight + 0.001);
            const isHDBefore = relevantItem && relevantItem.topUp !== undefined; // True only for Before HD logic

            if (relevantItem) {
                const index = ldTable.findIndex(item => item === relevantItem);
                
                // Determine the correct weight range for display
                const startWeight = index === 0 ? '< 50' : (ldTable[index - 1].maxWeight + 0.1).toFixed(0); 
                const endWeight = relevantItem.maxWeight === Infinity ? '≥ 100' : relevantItem.maxWeight.toFixed(0);

                // Card-style dosing display (matching Step 3 design)
                ldOutputHTML += `
                  <div style="background-color: white; border-radius: 5px; padding: 15px; margin-bottom: 12px;">
                    <div style="margin-bottom: 10px;">
                      <span style="color: #800000; font-weight: 600;">📊 Your Weight Range:</span>
                      <span style="margin-left: 8px; font-size: 1.1rem; font-weight: 700;">${startWeight.includes('<') || startWeight.includes('≥') ? startWeight : `${startWeight}–${endWeight}`} kg</span>
                    </div>
                    <div style="margin-bottom: ${isHDBefore ? '8px' : '0'};">
                      <span style="color: #800000; font-weight: 600;">💉 Loading Dose:</span>
                      <span style="margin-left: 8px; font-size: 1.1rem; font-weight: 700;">${relevantItem.dose.toLocaleString()} mg STAT</span>
                    </div>
                    ${isHDBefore ? `<div>
                      <span style="color: #800000; font-weight: 600;">➕ Top-Up Dose:</span>
                      <span style="margin-left: 8px; font-size: 1.1rem; font-weight: 700;">${relevantItem.topUp.toLocaleString()} mg</span>
                      <span style="color: #666; font-size: 0.85rem; margin-left: 5px;">(post-HD)</span>
                    </div>` : ''}
                  </div>`;
            }
        }
        
        // Top-up dose is already shown in the table, no footnote needed
        
        // Close colored wrapper
        ldOutputHTML += `</div>`;
    }
    if(document.getElementById('ldOutput')) document.getElementById('ldOutput').innerHTML = ldOutputHTML;
  

  // --- STEP 2: Maintenance Dose (MD) & Frequency Calculation ---
  let mdAdminRegimenText = 'Maintenance Dose not calculated.';

  if (abw < 40) {
    mdText = '<div class="warning-card">⚠️ Weight entered is below the validated range for adult patients. Please consult the Infectious Diseases (ID) or TDM Pharmacy team (Ext: 4124) for individualized dosing advice.</div>';
    mdData = null;
  } else if (status === 'HD' || (status === 'notHD' && crcl < 15)) {
    mdText = '<div class="warning-card">⚠️ The maintenance dose is based on Vancomycin TDM after the loading dose. Contact TDM Pharmacy for more information (Ext: 4124).</div>';
    mdData = null;
    mdAdminRegimenText = 'Maintenance dose dilution & administration not applicable. The maintenance dose is based on Vancomycin TDM after the loading dose. Contact TDM Pharmacy for more information (Ext: 4124).';
  } else { // CrCl >= 15 and Not on HD
    if (crcl >= 15 && crcl <= 29) {
      mdTable = MD_CRCL_15_29; mdHeader = 'Maintenance dose: 7.5 mg/kg Q24H';
    } else if (crcl >= 30 && crcl <= 49) {
      mdTable = MD_CRCL_30_49; mdHeader = 'Maintenance dose: 7.5–15 mg/kg Q12–24H';
    } else if (crcl >= 50 && crcl <= 59) {
      mdTable = MD_CRCL_50_59; mdHeader = 'Maintenance dose: 15 mg/kg Q12H';
    } else if (crcl >= 60) {
      mdTable = MD_CRCL_ABOVE_60; mdHeader = 'Maintenance dose: 15–20 mg/kg Q8–12H';
    }
    
        if (mdTable) {
            mdData = getMaintenanceDose(abw, mdTable);
            
            if (mdData) {
                const mdAdmin = getAdminInstruction(mdData.roundedDose, ivAccess);
                
                // --- TABLE FIRST (Primary Information) ---
                const relevantItem = mdTable.find(item => item.dose === mdData.fullDoseText); 

                if (relevantItem) {
                    const minWeight = relevantItem.minWeight.toFixed(0);
                    const maxWeight = relevantItem.maxWeight === Infinity ? '&#8734;' : relevantItem.maxWeight.toFixed(0);
                    
                    // Add colored wrapper with card-style design (matching Step 3)
                    mdText = `<div style="background-color: #FFF4D6; border-left: 4px solid #D68910; border-radius: 8px; padding: 20px; margin-bottom: 15px;">`;
                    
                    // Card-style dosing display
                    mdText += `
                      <div style="background-color: white; border-radius: 5px; padding: 15px; margin-bottom: 12px;">
                        <div style="margin-bottom: 10px;">
                          <span style="color: #D68910; font-weight: 600;">📊 Your Weight Range:</span>
                          <span style="margin-left: 8px; font-size: 1.1rem; font-weight: 700;">${minWeight}–${maxWeight.replace('.9', '').replace('.1', '')} kg</span>
                        </div>
                        <div>
                          <span style="color: #D68910; font-weight: 600;">💉 Maintenance Dose:</span>
                          <span style="margin-left: 8px; font-size: 1.1rem; font-weight: 700;">${relevantItem.dose}</span>
                        </div>
                      </div>`;
                }
                
                // Add conservative dosing note if asterisk present
                if (mdData.fullDoseText.includes('*')) {
                    mdText += `<p class="input-footnote" style="margin-top: 12px; font-size: 0.9rem; color: #D68910;">*May consider conservative dosing for patients at risk for Acute Kidney Injury (AKI) (e.g., elderly, concurrent nephrotoxic drugs) – refer ID if in doubt.</p>`;
                }
                
                // Close colored wrapper
                mdText += `</div>`;
                
                // 2. *** BUILD NEW STRING FOR CLINICAL NOTE (mdAdminRegimenText) ***
                if (mdAdmin) {
                    const fullDoseTextClean = mdData.fullDoseText.replace('*', '').trim();
                    
mdAdminRegimenText = `${fullDoseTextClean}, dilute each dose in ${mdAdmin.dilution}, administer over ${mdAdmin.time} hour${mdAdmin.time !== 1 ? 's' : ''}.`;
                } else {
                    mdAdminRegimenText = 'Maintenance Dose administration details unavailable.';
                }

      } else {
        mdText = '<div class="warning-card">⚠️ Could not determine maintenance dose for the provided weight range. Please consult TDM Pharmacy (Ext: 4124).</div>';
      }
    }
  }
  if(document.getElementById('mdOutput')) document.getElementById('mdOutput').innerHTML = mdText;

  // Add footnote only when there's an actual dose (not warning messages)
  const mdFootnoteDiv = document.getElementById('mdFootnote');
  if (mdFootnoteDiv) {
    if (mdData && !mdText.includes('warning-card')) {
      // Show footnote (conservative dosing note now appears below table instead)
      let footnoteHTML = `
        <div class="note-card">
          💡 <strong>Notes:</strong>
          <ul>
            <li>Subsequent maintenance doses will be based on TDM level (Refer to Step 4 for TDM sampling).</li>
            <li>While waiting for the TDM result, continue serving the Vancomycin unless the patient has severe AKI or poor urine output.</li>
            <li>Max Vancomycin dose: 2 g/DOSE or 4 g/DAY.</li>
          </ul>
        </div>`;
      
      mdFootnoteDiv.innerHTML = footnoteHTML;
      mdFootnoteDiv.style.display = 'block';
    } else {
      // Hide footnote for warning messages
      mdFootnoteDiv.style.display = 'none';
    }
  }

  
  // --- STEP 3: Administration (Dilution & Infusion Rate) ---
  let ldAdminOutputHTML = '<em>Loading dose not calculated due to incomplete/invalid input.</em>';
  if (ldData) {
      const ldAdmin = getAdminInstruction(ldData.roundedDose, ivAccess);
      if (ldAdmin) {
          ldAdminOutputHTML = `
              <div style="background-color: #F8E8E8; border-left: 4px solid #800000; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                <!-- Header with icon -->
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  
                  <strong style="color: #800000; font-size: 1.05rem;">Loading Dose: ${ldData.roundedDose.toLocaleString()} mg IV STAT</strong>
                </div>
                
                <!-- Dilution and administration details -->
                <div style="background-color: white; border-radius: 5px; padding: 12px; margin-bottom: 10px;">
                  <div style="margin-bottom: 8px;">
                    <span style="color: #800000; font-weight: 600;">📋 Dilution:</span>
                    <span style="margin-left: 8px;">${ldAdmin.dilution}</span>
                  </div>
                  <div style="margin-bottom: 8px;">
                    <span style="color: #800000; font-weight: 600;">⏱️ Infusion Time:</span>
                    <span style="margin-left: 8px;">${ldAdmin.time} hour${ldAdmin.time > 1 ? 's' : ''}</span>
                  </div>
                  <div>
                    <span style="color: #800000; font-weight: 600;">⚕️ Max Concentration:</span>
                    <span style="margin-left: 8px;">${ldAdmin.maxConc} (${ivAccess} line)</span>
                  </div>
                </div>
              </div>`;
      }
  }
  if(document.getElementById('ldAdminOutput')) document.getElementById('ldAdminOutput').innerHTML = ldAdminOutputHTML;

  let mdAdminOutputHTML = '';
  if (mdData) {
      const mdAdmin = getAdminInstruction(mdData.roundedDose, ivAccess);
      if (mdAdmin) {
        const fullDoseText = mdData.fullDoseText.replace('*', '').trim();
        const time = mdAdmin.time; 

        mdAdminOutputHTML = `
              <div style="background-color: #FFF4D6; border-left: 4px solid #D68910; border-radius: 8px; padding: 15px; margin-bottom: 10px;">
                <!-- Header with icon -->
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  
                  <strong style="color: #D68910; font-size: 1.05rem;">Maintenance Dose: ${fullDoseText}</strong>
                </div>
                
                <!-- Dilution and administration details -->
                <div style="background-color: white; border-radius: 5px; padding: 12px; margin-bottom: 10px;">
                  <div style="margin-bottom: 8px;">
                    <span style="color: #D68910; font-weight: 600;">📋 Dilution:</span>
                    <span style="margin-left: 8px;">${mdAdmin.dilution} per dose</span>
                  </div>
                  <div style="margin-bottom: 8px;">
                    <span style="color: #D68910; font-weight: 600;">⏱️ Infusion Time:</span>
                    <span style="margin-left: 8px;">${time} hour${time !== 1 ? 's' : ''} per dose</span>
                  </div>
                  <div>
                    <span style="color: #D68910; font-weight: 600;">⚕️ Max Concentration:</span>
                    <span style="margin-left: 8px;">${mdAdmin.maxConc} (${ivAccess} line)</span>
                  </div>
                </div>
              </div>`;
      }

  } else {
    mdAdminOutputHTML = mdAdminRegimenText.includes('not applicable') ? `<div class="warning-card" style="font-style: normal;">${mdAdminRegimenText}</div>` : mdAdminRegimenText;
  }
  if(document.getElementById('mdAdminOutput')) document.getElementById('mdAdminOutput').innerHTML = mdAdminOutputHTML;


// --- STEP 4: Therapeutic Drug Monitoring (TDM) Guidance ---
  
  // First, determine the timing (used in 4.1 and optionally in 4.2)
  let timingText = '';
  let doseReference = ''; // For use in 4.2 dynamic text
  
  if (status === 'notHD' && crcl < 15) {
    timingText = 'Take random TDM level 24 hours after Loading Dose.';
    doseReference = 'random TDM level 24 hours after Loading Dose';
  } else if (status === 'HD') {
    timingText = 'Take random TDM level in the morning, pre-HD.';
    doseReference = 'random TDM level in the morning, pre-HD';
  } else if (status === 'notHD' && crcl >= 15) {
    const mdFrequency = mdData ? mdData.freqText.replace('*', '').trim() : '';
    
    // Determine which dose to take TDM before
    let doseNum = '4th'; // Default for BD, TDS, QID
    
    if (mdFrequency === 'OD') {
      doseNum = '3rd';  // OD frequency uses 3rd dose
    }
    
    timingText = `Take Pre-level (Trough) 30 min BEFORE the ${doseNum} Maintenance Dose.`;
    doseReference = `the ${doseNum} Maintenance Dose`;
  } else {
    timingText = 'Please complete all required inputs.';
    doseReference = 'the next scheduled dose';
  }

  const isMRSA = indication === 'MRSA';

  // 4.1. When to Take the First TDM Sample (appears for ALL indications)
  let section41HTML = `<p><strong>${timingText}</strong></p>`;
  
  // Add note for MRSA patients about Step 4.2
  if (isMRSA && status === 'notHD') {
    section41HTML += `
      <p style="margin-top: 10px; padding: 10px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; font-size: 0.9rem;">
        <span style="font-weight: 700;">Note for MRSA infection:</span> Refer to <span style="font-weight: 700;">Step 4.2</span> below to determine if you need a post-dose (Peak) level.
      </p>`;
  }
  
  if(document.getElementById('tdmTimingOutput')) {
    document.getElementById('tdmTimingOutput').innerHTML = section41HTML;
  }

  // 4.2. Determine sampling method (ONLY for MRSA + not on HD)
  let section42HTML = '';
  let noteTDM1_val = '';
  let noteTDM2_val = '';
  let showSection42 = isMRSA && status === 'notHD';

if (showSection42) {
    // MRSA + Not on HD: Show AUC vs Trough guidance with modern side-by-side layout
    section42HTML = `
      <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 15px;">
        
        <!-- Left Card: Stable Renal Function (Green border) -->
        <div style="flex: 1; min-width: 300px; background-color: #f8f9fa; border-left: 4px solid #28a745; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header with emoji and title -->
          <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 15px;">
            <span style="font-size: 1.5rem; line-height: 1;">✅</span>
            <div>
              <div style="font-weight: 700; font-size: 1.05rem; color: #000; line-height: 1.3;">
                Stable Renal Function
              </div>
              <div style="color: #666; font-size: 0.9rem; margin-top: 2px;">
                (including stable CKD)
              </div>
            </div>
          </div>
          
          <!-- Post-dose requirement status -->
          <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 8px 12px; margin-bottom: 12px; color: #155724; font-weight: 600; font-size: 0.9rem;">
            Post-dose level required
          </div>
          
          <!-- Monitoring method -->
          <div style="margin-bottom: 12px; font-size: 0.95rem;">
            <strong>→ AUC-based monitoring</strong>
          </div>
          
          <!-- Sampling instructions -->
          <div style="font-size: 0.95rem; margin-bottom: 8px;">
            Take <span style="font-weight: 700; color: #28a745;">TWO</span> samples:
          </div>
          
          <ul style="margin-left: 20px; margin-top: 8px; margin-bottom: 0; font-size: 0.9rem; line-height: 1.6;">
            <li><strong>Pre-dose (Trough):</strong> 30 min BEFORE ${doseReference}</li>
            <li><strong>Post-dose (Peak):</strong> 1 hr AFTER complete infusion</li>
          </ul>
        </div>
        
        <!-- Right Card: Unstable Renal Function (Red border) -->
        <div style="flex: 1; min-width: 300px; background-color: #f8f9fa; border-left: 4px solid #dc3545; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header with emoji and title -->
          <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 15px;">
            <span style="font-size: 1.5rem; line-height: 1;">❌</span>
            <div>
              <div style="font-weight: 700; font-size: 1.05rem; color: #000; line-height: 1.3;">
                Unstable Renal Function
              </div>
              <div style="color: #666; font-size: 0.9rem; margin-top: 2px;">
                (e.g., AKI or HD)
              </div>
            </div>
          </div>
          
          <!-- Post-dose requirement status -->
          <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 8px 12px; margin-bottom: 12px; color: #721c24; font-weight: 600; font-size: 0.9rem;">
            Post-dose level NOT required
          </div>
          
          <!-- Monitoring method -->
          <div style="margin-bottom: 12px; font-size: 0.95rem;">
            <strong>→ Trough-based monitoring</strong>
          </div>
          
          <!-- Sampling instructions -->
          <div style="font-size: 0.95rem; margin-bottom: 8px;">
            Take <span style="font-weight: 700; color: #dc3545;">ONE</span> sample:
          </div>
          
          <ul style="margin-left: 20px; margin-top: 8px; margin-bottom: 0; font-size: 0.9rem; line-height: 1.6;">
            <li><strong>Pre-dose (Trough):</strong> 30 min BEFORE ${doseReference}</li>
          </ul>
        </div>
        
      </div>
      
      <!-- Centered footer note -->
      <p style="text-align: center; font-style: italic; color: var(--color-primary); font-size: 0.9rem; margin-top: 15px; margin-bottom: 10px;">
        Please correlate clinically.
      </p>
    `;
    
    // For clinical note
    noteTDM1_val = timingText.replace('30 min BEFORE the', '30 min before the').replace('random TDM level', 'TDM level').replace('.', '') + ` - Date & time: <input type="text" id="tdm1DateTime" value="" placeholder="[enter date/time]">`;
    noteTDM2_val = `Take Post-level (Peak) 1 hour after completion of infusion - Date & time: <input type="text" id="tdm2DateTime" value="" placeholder="[enter date/time]">`;


  } else {
    // MRSA + HD OR Non-MRSA: No section 4.2 content
    section42HTML = ''; 
    
    // For clinical note
    noteTDM1_val = timingText.replace('30 min BEFORE the', '30 min before the').replace('random TDM level', 'TDM level').replace('.', '') + ` - Date & time: <input type="text" id="tdm1DateTime" value="" placeholder="[enter date/time]">`;
    noteTDM2_val = '';
  }

  // Update or hide Section 4.2
  const section42Container = document.getElementById('tdmSamplingOutput');
  const section42Heading = document.getElementById('tdmSamplingHeading');
  
  if(section42Container) {
    section42Container.innerHTML = section42HTML;
    // Show or hide the entire section
    section42Container.style.display = showSection42 ? 'block' : 'none';
  }
  
  if(section42Heading) {
    section42Heading.style.display = showSection42 ? 'block' : 'none';
  }

  // Update Clinical Note TDM placeholders
  if(document.getElementById('noteTDM1')) document.getElementById('noteTDM1').innerHTML = noteTDM1_val;
  if(document.getElementById('noteTDM2')) document.getElementById('noteTDM2').innerHTML = noteTDM2_val;  
  // --- Sub-Output: Summary of Inputs (original, full indication text) ---
  const summaryHTML = `
      <ul>
          <li><strong>Actual Body Weight:</strong> ${abw} kg</li>
          <li><strong>Dialysis Status:</strong> ${document.getElementById('dialysisStatus').options[document.getElementById('dialysisStatus').selectedIndex].text}</li>
          ${status === 'HD' ? `<li><strong>Vancomycin Timing:</strong> ${document.getElementById('dialysisTiming').options[document.getElementById('dialysisTiming').selectedIndex].text.replace('Vancomycin started or planned to be given ', '')}</li>` : ''}
           ${status === 'notHD' ? `<li><strong>Serum Creatinine:</strong> ${scr_input} μmol/L</li>` : ''}
          ${status === 'notHD' ? `<li><strong>Creatinine Clearance:</strong> ${crcl.toFixed(1)} ml/min</li>` : ''}
          <li><strong>Indication:</strong> ${document.getElementById('indication').options[document.getElementById('indication').selectedIndex].text}</li>
          <li><strong>IV Access:</strong> ${document.getElementById('ivAccess').options[document.getElementById('ivAccess').selectedIndex].text}</li>
      </ul>`;
  if(document.getElementById('summaryOutput')) document.getElementById('summaryOutput').innerHTML = summaryHTML;

  // --- 6.0 Clinical Note Section (editable indication for clinical note only) ---
  const clinicalNoteSummaryHTML = `
      <ul>
          <li><strong>Actual Body Weight:</strong> ${abw} kg</li>
          <li><strong>Dialysis Status:</strong> ${document.getElementById('dialysisStatus').options[document.getElementById('dialysisStatus').selectedIndex].text}</li>
          ${status === 'HD' ? `<li><strong>Vancomycin Timing:</strong> ${document.getElementById('dialysisTiming').options[document.getElementById('dialysisTiming').selectedIndex].text.replace('Vancomycin started or planned to be given ', '')}</li>` : ''}
           ${status === 'notHD' ? `<li><strong>Serum Creatinine:</strong> ${scr_input} μmol/L</li>` : ''}
          ${status === 'notHD' ? `<li><strong>Creatinine Clearance:</strong> ${crcl.toFixed(1)} ml/min</li>` : ''}
          <li><strong>Indication:</strong> ${document.getElementById('indication').options[document.getElementById('indication').selectedIndex].text.split('(')[0].trim()} <input type="text" id="indicationSpecify" value="" placeholder="(please specify)" style="border: none; border-bottom: 2px solid #D68910; background: transparent; width: 300px; padding: 2px 4px; font-family: Arial, sans-serif; font-size: 13px; font-weight: normal;"></li>
          <li><strong>IV Access:</strong> ${document.getElementById('ivAccess').options[document.getElementById('ivAccess').selectedIndex].text}</li>
      </ul>`;
  if(document.getElementById('noteSummaryList')) document.getElementById('noteSummaryList').innerHTML = clinicalNoteSummaryHTML;
  if(document.getElementById('noteLDRegimen')) document.getElementById('noteLDRegimen').textContent = ldAdminRegimenText.replace('IV STAT', 'IV STAT');
  if(document.getElementById('noteMDRegimen')) document.getElementById('noteMDRegimen').textContent = mdAdminRegimenText.replace('IV Q', 'IV q');
}

// --- COPY TO NOTES LOGIC (FINAL CORRECTED) ---
function copyClinicalNote() {
  // Define the base styles for the note
  const bodyInlineStyle = `font-family: Calibri, Arial, sans-serif; font-size: 10pt;`;
  const titleInlineStyle = `
      color: #800000; 
      font-weight: 700; 
      font-style: italic; 
      font-size: 10pt; 
      font-family: Calibri, Arial, sans-serif;
  `;
  
  const htmlContentDiv = document.getElementById('clinicalNoteContent');
  
  // 1. Create a temporary container to manipulate the HTML without affecting the live page
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContentDiv.innerHTML; 
  
  // 2. APPLY USER INPUT VALUES TO THE COPIED HTML CONTENT (Rich Text Fixes)
  
  // Elements to fix in the cloned HTML (these are the elements containing the inputs)
  const drInput_temp = tempDiv.querySelector('#dr_input');
  const noteTDM1_temp = tempDiv.querySelector('#noteTDM1'); 
  const noteTDM2_temp = tempDiv.querySelector('#noteTDM2');

  const replaceInputWithValue = (liveInput, clonedInput) => {
    if (!liveInput || !clonedInput) return;
    
    // Get the value the user typed in (or the placeholder if empty)
    const userValue = liveInput.value.trim() || liveInput.placeholder;
    const valueToInsert = `<span style="text-decoration: underline;">${userValue}</span>`;
    
    // Replace the input field in the cloned HTML with the styled text
    clonedInput.outerHTML = valueToInsert;
  };
  
  // --- Fix Doctor's Name (Direct Input Element) ---
  const drInputLive = document.getElementById('dr_input');
  if(drInputLive && drInput_temp) {
      replaceInputWithValue(drInputLive, drInput_temp);
  }

  // --- Fix TDM Date/Time (Input Elements Nested in #noteTDM1/2) ---
  const liveTDMInput1 = document.getElementById('noteTDM1') ? document.getElementById('noteTDM1').querySelector('input') : null;
  const liveTDMInput2 = document.getElementById('noteTDM2') ? document.getElementById('noteTDM2').querySelector('input') : null;
  const clonedTDMInput1 = noteTDM1_temp ? noteTDM1_temp.querySelector('input') : null;
  const clonedTDMInput2 = noteTDM2_temp ? noteTDM2_temp.querySelector('input') : null;
  
  if (liveTDMInput1 && clonedTDMInput1) {
      replaceInputWithValue(liveTDMInput1, clonedTDMInput1);
  }
  if (liveTDMInput2 && clonedTDMInput2) {
      replaceInputWithValue(liveTDMInput2, clonedTDMInput2);
  }

  // --- Fix Indication Input (in Patient Summary) ---
  const indicationInputCloned = tempDiv.querySelector('#indicationSpecify');
  const indicationInputLive = document.getElementById('indicationSpecify');
  if (indicationInputLive && indicationInputCloned) {
      replaceInputWithValue(indicationInputLive, indicationInputCloned);
  }

  // 3. Apply styles and add spacing for copy-paste
  tempDiv.setAttribute('style', 'font-family: Calibri, Arial, sans-serif; font-size: 10pt;');
  
  // Add spacing between major sections by adding margin-bottom to divs
  tempDiv.querySelectorAll('div[style*="margin-bottom: 24px"]').forEach(div => {
      const currentStyle = div.getAttribute('style');
      div.setAttribute('style', currentStyle + ' margin-bottom: 30px !important;');
  });
  tempDiv.setAttribute('style', bodyInlineStyle);
  tempDiv.querySelectorAll('.card-title').forEach(titleElement => {
      titleElement.setAttribute('style', titleInlineStyle);
  });
  tempDiv.querySelectorAll('.bold-highlight').forEach(element => {
      element.setAttribute('style', `color: #000000; font-weight: 400; font-size: 10pt; font-family: Calibri, Arial, sans-serif;`);
      const labelStrong = element.querySelector('strong');
      if(labelStrong) {
          labelStrong.setAttribute('style', 'font-weight: 700; color: #000000;');
      }
  });
  tempDiv.querySelectorAll('p, li, ul').forEach(element => {
      if(!element.classList.contains('card-title')) {
         element.style.color = '#000000';
         element.style.fontWeight = '400';
      }
  });
  
  const htmlToCopy = tempDiv.innerHTML;


  // --- Prepare the Plain Text (This section should be fine) ---
  
  const doctorNamePlaceholder = drInputLive ? drInputLive.value.trim() : '_______________';
  // Match HTML version wording
  const introTextPlain = `Received query from Dr ${doctorNamePlaceholder} regarding IV Vancomycin initiation for this patient.`;
  
  const getTDMTextFromLiveDOM = (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return '';
    
    let baseText = element.textContent.trim();
    
    const input = element.querySelector('input');
    // CRITICAL: We need the value from the live input, not the placeholder text
    const userValue = input ? (input.value.trim() || input.placeholder) : '';
    
    // Replace the specific placeholder symbol \u25CF in the text content
    return baseText.replace('\u25CF', userValue).replace('â€” Date & time:', 'Date/Time:').replace('.', '').trim();
  };
  
  const tdm1 = getTDMTextFromLiveDOM('noteTDM1');
  const tdm2 = getTDMTextFromLiveDOM('noteTDM2');

  let textToCopy = '--- Hospital Sungai Buloh Clinical Note ---\n\n';
  textToCopy += 'VANCOMYCIN THERAPY RECOMMENDATION\n\n';
  textToCopy += introTextPlain + '\n\n'; 
  
  const abw = parseFloat(document.getElementById('abw').value);
  const statusText = document.getElementById('dialysisStatus').options[document.getElementById('dialysisStatus').selectedIndex].text;
  const crclValue = document.getElementById('crcl').value;
  const indicationText = document.getElementById('indication').options[document.getElementById('indication').selectedIndex].text;
  const ivAccessText = document.getElementById('ivAccess').options[document.getElementById('ivAccess').selectedIndex].text;
  const noteLDRegimenText = document.getElementById('noteLDRegimen').textContent;
  let noteMDRegimenText = document.getElementById('noteMDRegimen').textContent;
  
  if (noteMDRegimenText.includes('not applicable')) noteMDRegimenText = 'Maintenance dose based on TDM. Contact TDM Pharmacy for advice.';
  
  textToCopy += 'Patient Summary (as provided by the primary care team):\n';
  textToCopy += `• Actual Body Weight: ${abw} kg\n`;
  textToCopy += `• Dialysis Status: ${statusText}\n`;
  if (statusText.includes('Haemodialysis')) {
      const timingText = document.getElementById('dialysisTiming').options[document.getElementById('dialysisTiming').selectedIndex].text;
      if (!timingText.includes('Please select')) {
          textToCopy += `• Vancomycin Timing: ${timingText.replace('Vancomycin started or planned to be given ', '')}\n`;
      }
  }
  
  if (statusText === 'Not on Haemodialysis') {
      textToCopy += `• Serum Creatinine (μmol/L): ${document.getElementById('scr_input').value}\n`;
      textToCopy += `• Creatinine Clearance: ${crclValue} ml/min\n`;
  }
  
  // Get both the main indication text AND the user's specification
  const indicationMainText = document.getElementById('indication').options[document.getElementById('indication').selectedIndex].text.split('(')[0].trim();
  const indicationSpec = document.getElementById('indicationSpecify') ? document.getElementById('indicationSpecify').value.trim() : '';
  const fullIndication = indicationSpec ? `${indicationMainText} (${indicationSpec})` : indicationMainText;
  textToCopy += `• Indication: ${fullIndication}\n`;
  textToCopy += `• Type of IV Access: ${ivAccessText}\n\n`;

  textToCopy += 'Recommended Regimen:\n';
  textToCopy += `Loading Dose: ${noteLDRegimenText}\n`;
  textToCopy += `Maintenance Dose: ${noteMDRegimenText}\n\n`;

  textToCopy += 'Therapeutic Drug Monitoring (TDM):\n';
  
  // Build TDM1 text manually from the HTML content
  const tdm1Element = document.getElementById('noteTDM1');
  if (tdm1Element && tdm1Element.innerHTML && !tdm1Element.innerHTML.includes('not generated')) {
    // Get the input value
    const tdm1Input = document.getElementById('tdm1DateTime');
    const tdm1Value = tdm1Input ? tdm1Input.value.trim() : '';
    
    // Get the HTML and extract text before "- Date & time:"
    const tdm1Html = tdm1Element.innerHTML;
    const beforeDateTime = tdm1Html.split('- Date & time:')[0].replace(/<[^>]*>/g, '').trim();
    
    // Build complete line
    const tdm1Line = `${beforeDateTime} - Date/Time: ${tdm1Value}`;
    textToCopy += `• ${tdm1Line}\n`;
  }
  
  // Build TDM2 text manually from the HTML content  
  const tdm2Element = document.getElementById('noteTDM2');
  if (tdm2Element && tdm2Element.innerHTML && tdm2Element.innerHTML.includes('Post-level')) {
    // Get the input value
    const tdm2Input = document.getElementById('tdm2DateTime');
    const tdm2Value = tdm2Input ? tdm2Input.value.trim() : '';
    
    // Get the HTML and extract text before "- Date & time:"
    const tdm2Html = tdm2Element.innerHTML;
    const beforeDateTime = tdm2Html.split('- Date & time:')[0].replace(/<[^>]*>/g, '').trim();
    
    // Build complete line
    const tdm2Line = `${beforeDateTime} - Date/Time: ${tdm2Value}`;
    textToCopy += `• ${tdm2Line}\n`;
  }
  
  textToCopy += '\nRemarks:\n';
  textToCopy += '• Monitor renal profile (RP) and urine output regularly.\n';
  textToCopy += '• Ensure the patient remains well hydrated while on Vancomycin.\n';
  textToCopy += '• Avoid concomitant nephrotoxic agents where possible.\n';
  textToCopy += '• Infusion rate must not exceed 10 mg/min to minimize infusion-related reactions.\n';
  textToCopy += '-----------------------------------------------------------\n';
  
  // 8. Write both HTML and Plain Text to the clipboard (as before)
  const blobHtml = new Blob([htmlToCopy], { type: 'text/html' });
  const blobPlain = new Blob([textToCopy], { type: 'text/plain' });

  if (!navigator.clipboard || !navigator.clipboard.write) {
      alert("Your browser does not support copying rich text. Only plain text will be copied.");
      navigator.clipboard.writeText(textToCopy);
      return;
  }
  
  const clipboardItem = new ClipboardItem({
      'text/plain': blobPlain,
      'text/html': blobHtml
  });

  navigator.clipboard.write([clipboardItem]).then(() => {
    const button = document.querySelector('.copy-button');
    const originalText = button.innerHTML;
    button.innerHTML = '✅ Copied!';
    setTimeout(() => {
      button.innerHTML = originalText;
    }, 1500);
  }).catch(err => {
    console.error('Could not copy rich text: ', err);
    alert('Failed to copy formatted text. Please check browser permissions.');
  });
}
