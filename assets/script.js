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
    const freqText = parts[1].replace('*', '');
    
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
}

function clearBWInputs() {
  document.getElementById('bwForm').reset();
  if (document.getElementById('bwOutput')) document.getElementById('bwOutput').style.display = 'none';
}

function clearCrClInputs() {
  document.getElementById('crclForm').reset();
  if (document.getElementById('crclOutput')) document.getElementById('crclOutput').style.display = 'none';
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
}

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
      if (document.getElementById('ldFootnoteHD')) document.getElementById('ldFootnoteHD').style.display = 'block';
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

  let ldOutputHTML = `<p><strong>${ldText}</strong></p>`;
    if (ldData) {
        ldOutputHTML += `<p>Calculated loading dose (based on ABW ${abw} kg): <strong>${ldData.roundedDose.toLocaleString()} mg STAT</strong></p>`;
        if (ldData.topUp !== undefined) {
            ldOutputHTML += `<p class="bold-highlight">*Top-Up Dose (to be given 1 hour before HD ends): <strong>${ldData.topUp.toLocaleString()} mg</strong></p>`;
        }
        
        // --- MODIFIED TABLE GENERATION START (Issue 1 Fix) ---
        if (ldTable) {
            // CRITICAL: Find the specific item based on ABW to get the correct weight bounds and Top-Up value
            const relevantItem = ldTable.find(item => abw <= item.maxWeight + 0.001);
            const isHDBefore = relevantItem && relevantItem.topUp !== undefined; // True only for Before HD logic

            if (relevantItem) {
                const index = ldTable.findIndex(item => item === relevantItem);
                
                // Determine the correct weight range for display
                const startWeight = index === 0 ? '< 50' : (ldTable[index - 1].maxWeight + 0.1).toFixed(0); 
                const endWeight = relevantItem.maxWeight === Infinity ? '≥ 100' : relevantItem.maxWeight.toFixed(0);

                ldOutputHTML += `<br><h4>Dosing Table:</h4>`;
                
                // Add conditional Top-Up Dose header
                ldOutputHTML += `<table class="dose-table">
                    <tr>
                        <th>Weight (kg)</th>
                        <th>Loading Dose (mg STAT)</th>
                        ${isHDBefore ? '<th>Top-Up Dose (mg)</th>' : ''} 
                    </tr>
                    <tr>
                        <td class="weight-col">${startWeight.includes('<') || startWeight.includes('≥') ? startWeight : `${startWeight}–${endWeight}`}</td>
                        <td class="dose-col">${relevantItem.dose.toLocaleString()}</td>
                        ${isHDBefore ? `<td class="dose-col">${relevantItem.topUp.toLocaleString()}</td>` : ''} 
                    </tr>
                </table>`;
            }
        }
        // --- MODIFIED TABLE GENERATION END ---
    }
    if(document.getElementById('ldOutput')) document.getElementById('ldOutput').innerHTML = ldOutputHTML;
  

  // --- STEP 2: Maintenance Dose (MD) & Frequency Calculation ---
  if (document.getElementById('crcl60SpecialNote')) document.getElementById('crcl60SpecialNote').style.display = 'none';
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
                
                // --- Build mdText for Step 2 output (MD & Frequency) ---
                mdText = `<p><strong>${mdHeader}</strong></p>`;
                mdText += `<p>Calculated maintenance dose & frequency (based on ABW ${abw} kg): <strong>${mdData.fullDoseText}</strong></p>`;
                if (mdData.fullDoseText.includes('*')) {
                    if (document.getElementById('crcl60SpecialNote')) document.getElementById('crcl60SpecialNote').style.display = 'list-item';
                }
                
                // 2. *** BUILD NEW STRING FOR CLINICAL NOTE (mdAdminRegimenText) ***
                if (mdAdmin) {
                    const fullDoseTextClean = mdData.fullDoseText.replace('*', '').trim();
                    
mdAdminRegimenText = `${fullDoseTextClean}, dilute each dose in ${mdAdmin.dilution}, administer over ${mdAdmin.time} hour${mdAdmin.time !== 1 ? 's' : ''}.`;
                } else {
                    mdAdminRegimenText = 'Maintenance Dose administration details unavailable.';
                }


                // --- CORRECTED TABLE GENERATION START ---
                const relevantItem = mdTable.find(item => item.dose === mdData.fullDoseText); 

                if (relevantItem) {
                    const minWeight = relevantItem.minWeight.toFixed(0);
                    const maxWeight = relevantItem.maxWeight === Infinity ? '&#8734;' : relevantItem.maxWeight.toFixed(0);
                    
                    mdText += `<br><h4>Dosing Table:</h4>`;
                    
                    mdText += `<table class="dose-table">
                        <tr><th>Weight (kg)</th><th>Dose & Frequency</th></tr>
                        <tr>
                            <td class="weight-col">${minWeight}–${maxWeight.replace('.9', '').replace('.1', '')}</td>
                            <td class="dose-col">${relevantItem.dose}</td>
                        </tr>
                    </table>`;
                }

      } else {
        mdText = '<div class="warning-card">⚠️ Could not determine maintenance dose for the provided weight range. Please consult TDM Pharmacy (Ext: 4124).</div>';
      }
    }
  }
  if(document.getElementById('mdOutput')) document.getElementById('mdOutput').innerHTML = mdText;

  
  // --- STEP 3: Administration (Dilution & Infusion Rate) ---
  let ldAdminOutputHTML = '<em>Loading dose not calculated due to incomplete/invalid input.</em>';
  if (ldData) {
      const ldAdmin = getAdminInstruction(ldData.roundedDose, ivAccess);
      if (ldAdmin) {
          ldAdminOutputHTML = `
              <p><strong>Dose: ${ldData.roundedDose.toLocaleString()} mg IV STAT</strong></p>
              <div style="margin-bottom: 5px; margin-top: 10px; line-height: 1.4;">
                  •&nbsp;Dilute in <strong>${ldAdmin.dilution}</strong>
                  <br>
                  •&nbsp;Administer over <strong>${ldAdmin.time} hour${ldAdmin.time > 1 ? 's' : ''}</strong>
              </div>
              <p class="input-footnote" style="margin-top: 5px; font-weight: normal;">
                  Footnote: Maximum concentration for ${ivAccess} line: ${ldAdmin.maxConc}
              </p>`;
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
        <p><strong>Dose: ${fullDoseText}</strong></p>
        <div style="margin-bottom: 5px; margin-top: 10px; line-height: 1.4;">
        •&nbsp;Dilute each dose in <strong>${mdAdmin.dilution}</strong><br> 
        •&nbsp;Administer over <strong>${time} hour${time !== 1 ? 's' : ''}</strong>
        </div>
        <p class="input-footnote" style="margin-top: 5px; font-weight: normal;">
        Footnote: Maximum concentration for ${ivAccess} line: ${mdAdmin.maxConc}
        </p>`;
      }

  } else {
    mdAdminOutputHTML = mdAdminRegimenText.includes('not applicable') ? `<div class="warning-card" style="font-style: normal;">${mdAdminRegimenText}</div>` : mdAdminRegimenText;
  }
  if(document.getElementById('mdAdminOutput')) document.getElementById('mdAdminOutput').innerHTML = mdAdminOutputHTML;


// --- STEP 4: Therapeutic Drug Monitoring (TDM) Guidance ---
  
  // 4.1. Determine Sampling Method
  let target = '';
  let samplingText = '';
  let noteTDM1_val = '';
  let noteTDM2_val = '';
  
  const isMRSA = indication === 'MRSA';
  const mdFrequency = mdData ? mdData.freqText.replace('*', '') : '';

  if (isMRSA && status === 'notHD') {
          
      // (a) MRSA + Not on HD (Dual Guidance: Stable AUC and Unstable Trough/AKI)
      target = `<span style="font-style: normal; font-weight: 700;">If Renal Function is Stable (including stable CKD):</span>`;
      samplingText = `
          \u2022 Target AUC\u2082\u2084 = 400 – 600 mg\u00B7h/L
          <ul><li>Take Pre-level (Trough) \u2192 30 minutes BEFORE the next scheduled dose</li><li>Take Post-level (Peak) \u2192 1 hour AFTER completion of vancomycin infusion</li></ul>
          <br>
          <strong style="font-style: normal;">If Renal Function is Unstable (e.g., AKI):</strong>
          \u2022 Target Pre-level (Trough) = 15 – 20 mg/L (10.4 – 13.8 \u00B5mol/L)
          <br>\u2022 Take Pre-level (Trough) \u2192 30 minutes BEFORE the next scheduled dose
          <br><br>
          <span style="font-style: italic; color: var(--color-primary);">Please correlate clinically.</span>
      `;
      // For clinical note, include the Post-level/Peak instruction
      noteTDM2_val = `Take Post-level (Peak) 1 hour after completion of infusion - Date & time: <input type="text" value="" placeholder="\u25CF">`;

  } else if (isMRSA && status === 'HD') {
      
      // (b) MRSA + ESRF on HD (Unstable HD Guidance Only)
      target = `<span style="font-style: normal; font-weight: 700;">If Renal Function is Unstable (e.g., HD):</span>`;
      samplingText = `
          \u2022 Target Pre-level (Trough) = 15 – 20 mg/L (10.4 – 13.8 \u00B5mol/L)
          <br>\u2022 Take Pre-level (Trough) \u2192 30 minutes BEFORE the next scheduled dose
          <br><br>
          <span style="font-style: italic; color: var(--color-primary);">Please correlate clinically.</span>
      `;
      noteTDM2_val = ''; // No peak level for HD

  } else if (indication === 'CNS') {
    target = 'Target Trough = 15 – 20 mg/L (10.4 – 13.8 \u00B5mol/L)';
    samplingText = 'Take Pre-level (Trough) \u2192 30 minutes BEFORE the next scheduled dose';
  } else if (['SSTI', 'UTI'].includes(indication)) {
    target = 'Target Trough = 10 – 15 mg/L (6.9 – 10.4 \u00B5mol/L)';
    samplingText = 'Take Pre-level (Trough) \u2192 30 minutes BEFORE the next scheduled dose';
  } else if (['MRCONS', 'Enterococcus'].includes(indication)) {
    target = 'Target Trough = 10 – 20 mg/L (6.9 – 13.8 \u00B5mol/L)';
    samplingText = 'Take Pre-level (Trough) \u2192 30 minutes BEFORE the next scheduled dose';
  }
  if(document.getElementById('tdmSamplingOutput')) document.getElementById('tdmSamplingOutput').innerHTML = `<p><strong>${target}</strong></p><p>${samplingText}</p>`;

  // 4.2. When to Take the First TDM Sample
  let timingText = '';

  if (status === 'notHD' && crcl < 15) {
    timingText = 'Take random TDM level 24 hours after Loading Dose.';
  } else if (status === 'HD') {
    timingText = 'Take random TDM level in the morning, pre-HD.';
  } else if (status === 'notHD' && crcl >= 15) {
    let doseNum = (mdFrequency.includes('OD')) ? '3rd' : '4th';
    timingText = `Take Pre-level (Trough) 30 min BEFORE the ${doseNum} Maintenance Dose.`;
  } else {
    timingText = 'Please complete all required inputs.';
  }
  if(document.getElementById('tdmTimingOutput')) document.getElementById('tdmTimingOutput').innerHTML = `<p><strong>${timingText}</strong></p>`;
  
  // Update Clinical Note TDM placeholders
  noteTDM1_val = (timingText.includes('3rd') || timingText.includes('4th') || timingText.includes('random TDM')) ? timingText.replace('30 min BEFORE the', '30 min before the').replace('random TDM level', 'TDM level').replace('.', '') + ` - Date & time: <input type="text" value="" placeholder="\u25CF">` : 'TDM instructions not generated.';
  
  if(document.getElementById('noteTDM1')) document.getElementById('noteTDM1').innerHTML = noteTDM1_val;
  if(document.getElementById('noteTDM2')) document.getElementById('noteTDM2').innerHTML = noteTDM2_val;
  
  // --- Sub-Output: Summary of Inputs ---
  const summaryHTML = `
      <ul>
          <li><strong>Actual Body Weight:</strong> ${abw} kg</li>
          <li><strong>Dialysis Status:</strong> ${document.getElementById('dialysisStatus').options[document.getElementById('dialysisStatus').selectedIndex].text}</li>
          ${status === 'HD' ? `<li><strong>Vancomycin Timing:</strong> ${document.getElementById('dialysisTiming').options[document.getElementById('dialysisTiming').selectedIndex].text.replace('Vancomycin started or planned to be given ', '')}</li>` : ''}
           ${status === 'notHD' ? `<li><strong>Serum Creatinine:</strong> ${scr_input} µmol/L</li>` : ''}
          ${status === 'notHD' ? `<li><strong>Creatinine Clearance:</strong> ${crcl.toFixed(1)} ml/min</li>` : ''}
          <li><strong>Indication:</strong> ${document.getElementById('indication').options[document.getElementById('indication').selectedIndex].text}</li>
          <li><strong>IV Access:</strong> ${document.getElementById('ivAccess').options[document.getElementById('ivAccess').selectedIndex].text}</li>
      </ul>`;
  if(document.getElementById('summaryOutput')) document.getElementById('summaryOutput').innerHTML = summaryHTML;

  // --- 6.0 Clinical Note Section (Auto-Generated) ---
  if(document.getElementById('noteSummaryList')) document.getElementById('noteSummaryList').innerHTML = summaryHTML;
  if(document.getElementById('noteLDRegimen')) document.getElementById('noteLDRegimen').textContent = ldAdminRegimenText.replace('IV STAT', 'IV STAT');
  if(document.getElementById('noteMDRegimen')) document.getElementById('noteMDRegimen').textContent = mdAdminRegimenText.replace('IV Q', 'IV q');
}

// --- COPY TO NOTES LOGIC (FINAL CORRECTED) ---
function copyClinicalNote() {
  // Define the base styles for the note
  const bodyInlineStyle = `font-family: Arial, Helvetica, sans-serif; font-size: 13px;`;
  const titleInlineStyle = `
      color: #800000; 
      font-weight: 700; 
      font-style: italic; 
      font-size: 13px; 
      font-family: Arial, Helvetica, sans-serif;
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


  // 3. Apply styles (as before)
  tempDiv.setAttribute('style', bodyInlineStyle);
  tempDiv.querySelectorAll('.card-title').forEach(titleElement => {
      titleElement.setAttribute('style', titleInlineStyle);
  });
  tempDiv.querySelectorAll('.bold-highlight').forEach(element => {
      element.setAttribute('style', `color: #000000; font-weight: 400; font-size: 13px;`);
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
  // Use the new requested wording for the intro sentence
  const introTextPlain = `Received query regarding IV Vancomycin initiation for this patient from Dr: ${doctorNamePlaceholder}`;
  
  const getTDMTextFromLiveDOM = (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) return '';
    
    let baseText = element.textContent.trim();
    
    const input = element.querySelector('input');
    // CRITICAL: We need the value from the live input, not the placeholder text
    const userValue = input ? (input.value.trim() || input.placeholder) : '';
    
    // Replace the specific placeholder symbol \u25CF in the text content
    return baseText.replace('\u25CF', userValue).replace('— Date & time:', 'Date/Time:').replace('.', '').trim();
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
  if (statusText.includes('Haemodialysis')) textToCopy += `• Vancomycin Timing: ${document.getElementById('dialysisTiming').options[document.getElementById('dialysisTiming').selectedIndex].text.replace('Vancomycin started or planned to be given ', '')}\n`;
  
  if (statusText === 'Not on Haemodialysis') {
      textToCopy += `• Serum Creatinine (µmol/L): ${document.getElementById('scr_input').value}\n`;
      textToCopy += `• Creatinine Clearance: ${crclValue} ml/min\n`;
  }
  
  textToCopy += `• Indication: ${indicationText}\n`;
  textToCopy += `• Type of IV Access: ${ivAccessText}\n\n`;

  textToCopy += 'Recommended Regimen:\n';
  textToCopy += `Loading Dose: ${noteLDRegimenText}\n`;
  textToCopy += `Maintenance Dose: ${noteMDRegimenText}\n\n`;

  textToCopy += 'Therapeutic Drug Monitoring (TDM):\n';
  if(tdm1 && tdm1 !== 'TDM instructions not generated.') textToCopy += `• ${tdm1}\n`;
  if(tdm2 && tdm2.includes('Post-level')) textToCopy += `• ${tdm2}\n`;
  
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
