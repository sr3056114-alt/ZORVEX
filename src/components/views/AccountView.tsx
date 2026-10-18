import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { useBalance } from '../../../App';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelectorModal, TimezoneSelectorModal } from '../LanguageTimezoneModal';
import { ArrowLeft, User, ShieldCheck, Lock, X, Check, Settings, Globe, Clock, ChevronDown } from 'lucide-react';
import { db } from '../../firebase';

const defaultTheme = {
  bg: 'bg-[var(--bg-main)]',
  panelBg: 'bg-[var(--bg-panel)]',
  border: 'border-[var(--border-color)]',
  text: 'text-[var(--text-primary)]',
  textMuted: 'text-[var(--text-muted)]',
  inputBg: 'bg-transparent'
};

export default function AccountView({ theme, isLight, onBack }: { theme?: any, isLight?: boolean, onBack?: () => void }) {
  const currentTheme = theme || defaultTheme;
  const { showDocumentVerification, userProfile, setUserProfile } = useBalance();
  const { language, setLanguage, timezone, setTimezone, t } = useLanguage();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isTzModalOpen, setIsTzModalOpen] = useState(false);
  
  const [tempProfile, setTempProfile] = useState(userProfile);
  
  // Security preferences states
  const [mfaLogin, setMfaLogin] = useState(true);
  const [mfaWithdraw, setMfaWithdraw] = useState(true);
  
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
    const [uploadingKyc, setUploadingKyc] = useState(false);
  const [kycInstructions, setKycInstructions] = useState('');
  const [kycAllowedTypes, setKycAllowedTypes] = useState('');
  const [kycMaxSize, setKycMaxSize] = useState('5');
  const [kycFormats, setKycFormats] = useState('');
  
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'settings'), (snap) => {
      const docs = snap.docs;
      const getVal = (id: string, def: string) => {
        const d = docs.find((d: any) => d.id === id);
        return d ? d.data().value : def;
      };
      setKycInstructions(getVal('kyc_instructions', 'Please upload a clear photo of your government ID.'));
      setKycAllowedTypes(getVal('kyc_allowed_types', 'Aadhaar, PAN, Passport'));
      setKycMaxSize(getVal('kyc_max_size', '5'));
      setKycFormats(getVal('kyc_formats', 'JPG, PNG, PDF'));
    }, (err) => console.warn(err));
    return () => unsub();
  }, []);


  useEffect(() => {
     let unsub: (() => void) | null = null;
     const userId = localStorage.getItem('user_uid');
     if (userId) {
       unsub = onSnapshot(doc(db, 'users', userId), (snap) => {
         if (snap.exists() && snap.data().kycStatus) {
           setKycStatus(snap.data().kycStatus);
         }
       }, (err) => console.warn('AccountView user err:', err));
     }
     return () => {
       if (unsub) unsub();
     };
  }, []);

  const handleImageUpload = (e: any, setUrl: any) => {
    const file = e.target.files[0];
    
    if (file) {
      if (file.size > Number(kycMaxSize) * 1024 * 1024) {
        alert(`File is too large. Max size is ${kycMaxSize}MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setUrl(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitKyc = async () => {
     if (!frontImage || !backImage) {
        alert('Please upload both Front and Back images');
        return;
     }
     setUploadingKyc(true);
     try {
       const userId = localStorage.getItem('user_uid');
       const email = localStorage.getItem('user_email') || 'User';
       if (userId) {
         const { addDoc, collection } = await import('firebase/firestore');
         await addDoc(collection(db, 'kyc'), {
           userId,
           email,
           frontImage,
           backImage,
           status: 'PENDING',
           timestamp: Date.now()
         });
         const { doc, updateDoc } = await import('firebase/firestore');
         await updateDoc(doc(db, 'users', userId), { kycStatus: 'PENDING' });
         alert('KYC documents submitted for review!');
       }
     } catch(e) {
       console.error(e);
       alert('Error submitting KYC');
     }
     setUploadingKyc(false);
  };


  // Update temp profile if global profile changes
  useEffect(() => {
    setTempProfile(userProfile);
  }, [userProfile]);

  const handleSave = () => {
    // Check if required fields are filled to mark as verified
    const isComplete = tempProfile.firstName.trim() !== '' && 
                       tempProfile.lastName.trim() !== '' && 
                       tempProfile.dob.trim() !== '' && 
                       tempProfile.aadhaar.trim() !== '' &&
                       tempProfile.address.trim() !== '';
                       
    setUserProfile({
      ...tempProfile,
      isVerified: isComplete
    });
    
    if (isComplete) {
       alert(t('accountVerifiedSuccess'));
    } else {
       alert(t('profileSavedNeedMore'));
    }
  };
  
  const handleChangePassword = () => {
    alert(t('passwordResetSent'));
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm(t('deleteAccountConfirm'))) {
      alert(t('delete'));
      window.location.reload();
    }
  };

  return (
    <div className={`flex-1 ${currentTheme.bg} overflow-y-auto ${theme ? '' : 'p-8'}`}>
      <div className="max-w-5xl mx-auto flex flex-col gap-10 pb-10">
          {onBack && (
      <div className="mb-4">
        <button onClick={onBack} className={`flex items-center gap-2 ${currentTheme.textMuted} hover:${currentTheme.text} transition-colors font-bold text-sm bg-black/20 px-4 py-2 rounded shadow`}>
          <ArrowLeft size={16} /> {t('backToTrade')}
        </button>
      </div>
          )}
        <div className="flex flex-col gap-6">
          <h2 className={`${currentTheme.text} font-bold text-lg`}>{t('personalData')}</h2>
          
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full ${currentTheme.panelBg} border ${currentTheme.border} flex items-center justify-center`}>
              <User size={32} className={currentTheme.textMuted} />
            </div>
            <div>
              <div className={`${currentTheme.text} font-bold text-sm`}>tradersandeep890@gmail.com</div>
              <div className={`${currentTheme.textMuted} text-xs mt-0.5`}>ID: 92361458</div>
              {userProfile.isVerified ? (
                 <div className={`bg-[#0ba259] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm w-fit mt-1 flex items-center gap-1`}>
                   <Check size={10} strokeWidth={3} /> {t('verified')}
                 </div>
              ) : (
                 <div className={`bg-[#e33f4a] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm w-fit mt-1 flex items-center gap-1`}>
                   <X size={10} strokeWidth={3} /> {t('notVerified')}
                 </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5 relative">
              <label className={`${currentTheme.textMuted} text-[11px] absolute -top-2 left-2 ${currentTheme.panelBg} px-1 font-medium`}>{t('nickname')}</label>
              <input type="text" value={tempProfile.nickname || (userProfile.uid ? userProfile.uid.substring(0,6).toUpperCase() : '000000')} disabled className={`${currentTheme.inputBg} border ${currentTheme.border} rounded px-3 py-2 text-gray-500 text-sm outline-none cursor-not-allowed`} />
            </div>
            <div className="flex flex-col gap-1.5 relative mt-2">
              <label className={`${currentTheme.textMuted} text-[11px] absolute -top-2 left-2 ${currentTheme.panelBg} px-1 font-medium`}>{t('firstName')}</label>
              <input type="text" value={tempProfile.firstName} onChange={e => setTempProfile({...tempProfile, firstName: e.target.value.replace(/[^a-zA-Z\s]/g, "")})} placeholder={t('emptyField')} className={`${currentTheme.inputBg} border ${currentTheme.border} rounded px-3 py-2 ${currentTheme.text} text-sm outline-none focus:border-[#1e88e5]`} />
            </div>
            <div className="flex flex-col gap-1.5 relative mt-2">
              <label className={`${currentTheme.textMuted} text-[11px] absolute -top-2 left-2 ${currentTheme.panelBg} px-1 font-medium`}>{t('lastName')}</label>
              <input type="text" value={tempProfile.lastName} onChange={e => setTempProfile({...tempProfile, lastName: e.target.value.replace(/[^a-zA-Z\s]/g, "")})} placeholder={t('emptyField')} className={`${currentTheme.inputBg} border ${currentTheme.border} rounded px-3 py-2 ${currentTheme.text} text-sm outline-none focus:border-[#1e88e5]`} />
            </div>
            <div className="flex flex-col gap-1.5 relative mt-2">
              <label className={`${currentTheme.textMuted} text-[11px] absolute -top-2 left-2 ${currentTheme.panelBg} px-1 font-medium`}>{t('dateOfBirth')}</label>
              <input type="text" value={tempProfile.dob} onChange={e => {
                let val = e.target.value.replace(/\D/g, "");
                if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
                if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 9);
                setTempProfile({...tempProfile, dob: val});
              }} placeholder="dd-mm-yyyy" className={`${currentTheme.inputBg} border ${currentTheme.border} rounded px-3 py-2 ${currentTheme.text} text-sm outline-none focus:border-[#1e88e5]`} />
            </div>
            <div className="flex flex-col gap-1.5 relative mt-2">
              <label className={`${currentTheme.textMuted} text-[11px] absolute -top-2 left-2 ${currentTheme.panelBg} px-1 font-medium`}>{t('aadhaar')}</label>
              <input type="text" maxLength={12} value={tempProfile.aadhaar} onChange={e => setTempProfile({...tempProfile, aadhaar: e.target.value.replace(/\D/g, "")})} placeholder={t('emptyField')} className={`${currentTheme.inputBg} border ${currentTheme.border} rounded px-3 py-2 ${currentTheme.text} text-sm outline-none focus:border-[#1e88e5]`} />
            </div>
            <div className="flex flex-col gap-1.5 relative mt-2">
              <label className={`${currentTheme.textMuted} text-[11px] absolute -top-2 left-2 ${currentTheme.panelBg} px-1 font-medium`}>{t('country')}</label>
              <select value={tempProfile.country} onChange={e => setTempProfile({...tempProfile, country: e.target.value})} className={`${currentTheme.inputBg} border ${currentTheme.border} rounded px-3 py-2 ${currentTheme.textMuted} text-sm outline-none focus:border-[#1e88e5] appearance-none`}>
                <option value="Afghanistan">Afghanistan</option>
                <option value="Albania">Albania</option>
                <option value="Algeria">Algeria</option>
                <option value="Andorra">Andorra</option>
                <option value="Angola">Angola</option>
                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                <option value="Argentina">Argentina</option>
                <option value="Armenia">Armenia</option>
                <option value="Australia">Australia</option>
                <option value="Austria">Austria</option>
                <option value="Azerbaijan">Azerbaijan</option>
                <option value="Bahamas">Bahamas</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Bangladesh">Bangladesh</option>
                <option value="Barbados">Barbados</option>
                <option value="Belarus">Belarus</option>
                <option value="Belgium">Belgium</option>
                <option value="Belize">Belize</option>
                <option value="Benin">Benin</option>
                <option value="Bhutan">Bhutan</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                <option value="Botswana">Botswana</option>
                <option value="Brazil">Brazil</option>
                <option value="Brunei">Brunei</option>
                <option value="Bulgaria">Bulgaria</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Burundi">Burundi</option>
                <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                <option value="Cabo Verde">Cabo Verde</option>
                <option value="Cambodia">Cambodia</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Canada">Canada</option>
                <option value="Central African Republic">Central African Republic</option>
                <option value="Chad">Chad</option>
                <option value="Chile">Chile</option>
                <option value="China">China</option>
                <option value="Colombia">Colombia</option>
                <option value="Comoros">Comoros</option>
                <option value="Congo">Congo</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Croatia">Croatia</option>
                <option value="Cuba">Cuba</option>
                <option value="Cyprus">Cyprus</option>
                <option value="Czechia">Czechia</option>
                <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
                <option value="Denmark">Denmark</option>
                <option value="Djibouti">Djibouti</option>
                <option value="Dominica">Dominica</option>
                <option value="Dominican Republic">Dominican Republic</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Egypt">Egypt</option>
                <option value="El Salvador">El Salvador</option>
                <option value="Equatorial Guinea">Equatorial Guinea</option>
                <option value="Eritrea">Eritrea</option>
                <option value="Estonia">Estonia</option>
                <option value="Eswatini">Eswatini</option>
                <option value="Ethiopia">Ethiopia</option>
                <option value="Fiji">Fiji</option>
                <option value="Finland">Finland</option>
                <option value="France">France</option>
                <option value="Gabon">Gabon</option>
                <option value="Gambia">Gambia</option>
                <option value="Georgia">Georgia</option>
                <option value="Germany">Germany</option>
                <option value="Ghana">Ghana</option>
                <option value="Greece">Greece</option>
                <option value="Grenada">Grenada</option>
                <option value="Guatemala">Guatemala</option>
                <option value="Guinea">Guinea</option>
                <option value="Guinea-Bissau">Guinea-Bissau</option>
                <option value="Guyana">Guyana</option>
                <option value="Haiti">Haiti</option>
                <option value="Holy See">Holy See</option>
                <option value="Honduras">Honduras</option>
                <option value="Hungary">Hungary</option>
                <option value="Iceland">Iceland</option>
                <option value="India">India</option>
                <option value="Indonesia">Indonesia</option>
                <option value="Iran">Iran</option>
                <option value="Iraq">Iraq</option>
                <option value="Ireland">Ireland</option>
                <option value="Israel">Israel</option>
                <option value="Italy">Italy</option>
                <option value="Jamaica">Jamaica</option>
                <option value="Japan">Japan</option>
                <option value="Jordan">Jordan</option>
                <option value="Kazakhstan">Kazakhstan</option>
                <option value="Kenya">Kenya</option>
                <option value="Kiribati">Kiribati</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Kyrgyzstan">Kyrgyzstan</option>
                <option value="Laos">Laos</option>
                <option value="Latvia">Latvia</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Lesotho">Lesotho</option>
                <option value="Liberia">Liberia</option>
                <option value="Libya">Libya</option>
                <option value="Liechtenstein">Liechtenstein</option>
                <option value="Lithuania">Lithuania</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Malawi">Malawi</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Maldives">Maldives</option>
                <option value="Mali">Mali</option>
                <option value="Malta">Malta</option>
                <option value="Marshall Islands">Marshall Islands</option>
                <option value="Mauritania">Mauritania</option>
                <option value="Mauritius">Mauritius</option>
                <option value="Mexico">Mexico</option>
                <option value="Micronesia">Micronesia</option>
                <option value="Moldova">Moldova</option>
                <option value="Monaco">Monaco</option>
                <option value="Mongolia">Mongolia</option>
                <option value="Montenegro">Montenegro</option>
                <option value="Morocco">Morocco</option>
                <option value="Mozambique">Mozambique</option>
                <option value="Myanmar">Myanmar</option>
                <option value="Namibia">Namibia</option>
                <option value="Nauru">Nauru</option>
                <option value="Nepal">Nepal</option>
                <option value="Netherlands">Netherlands</option>
                <option value="New Zealand">New Zealand</option>
                <option value="Nicaragua">Nicaragua</option>
                <option value="Niger">Niger</option>
                <option value="Nigeria">Nigeria</option>
                <option value="North Korea">North Korea</option>
                <option value="North Macedonia">North Macedonia</option>
                <option value="Norway">Norway</option>
                <option value="Oman">Oman</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Palau">Palau</option>
                <option value="Palestine State">Palestine State</option>
                <option value="Panama">Panama</option>
                <option value="Papua New Guinea">Papua New Guinea</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Peru">Peru</option>
                <option value="Philippines">Philippines</option>
                <option value="Poland">Poland</option>
                <option value="Portugal">Portugal</option>
                <option value="Qatar">Qatar</option>
                <option value="Romania">Romania</option>
                <option value="Russia">Russia</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                <option value="Saint Lucia">Saint Lucia</option>
                <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                <option value="Samoa">Samoa</option>
                <option value="San Marino">San Marino</option>
                <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Senegal">Senegal</option>
                <option value="Serbia">Serbia</option>
                <option value="Seychelles">Seychelles</option>
                <option value="Sierra Leone">Sierra Leone</option>
                <option value="Singapore">Singapore</option>
                <option value="Slovakia">Slovakia</option>
                <option value="Slovenia">Slovenia</option>
                <option value="Solomon Islands">Solomon Islands</option>
                <option value="Somalia">Somalia</option>
                <option value="South Africa">South Africa</option>
                <option value="South Korea">South Korea</option>
                <option value="South Sudan">South Sudan</option>
                <option value="Spain">Spain</option>
                <option value="Sri Lanka">Sri Lanka</option>
                <option value="Sudan">Sudan</option>
                <option value="Suriname">Suriname</option>
                <option value="Sweden">Sweden</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Syria">Syria</option>
                <option value="Tajikistan">Tajikistan</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Thailand">Thailand</option>
                <option value="Timor-Leste">Timor-Leste</option>
                <option value="Togo">Togo</option>
                <option value="Tonga">Tonga</option>
                <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                <option value="Tunisia">Tunisia</option>
                <option value="Turkey">Turkey</option>
                <option value="Turkmenistan">Turkmenistan</option>
                <option value="Tuvalu">Tuvalu</option>
                <option value="Uganda">Uganda</option>
                <option value="Ukraine">Ukraine</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States of America">United States of America</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Uzbekistan">Uzbekistan</option>
                <option value="Vanuatu">Vanuatu</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Vietnam">Vietnam</option>
                <option value="Yemen">Yemen</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 relative mt-2">
              <label className={`${currentTheme.textMuted} text-[11px] absolute -top-2 left-2 ${currentTheme.panelBg} px-1 font-medium`}>{t('address')}</label>
              <input type="text" value={tempProfile.address} onChange={e => setTempProfile({...tempProfile, address: e.target.value})} placeholder={t('emptyField')} className={`${currentTheme.inputBg} border ${currentTheme.border} rounded px-3 py-2 ${currentTheme.text} text-sm outline-none focus:border-[#1e88e5]`} />
            </div>
            <button onClick={handleSave} className={`w-full bg-[#1e88e5] hover:bg-[#1a7acc] text-white font-bold rounded py-3 transition-colors mt-2 cursor-pointer`}>
              {t('save')}
            </button>
          </div>
        </div>

        {/* Documents verification */}

        {showDocumentVerification && (<div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className={`${currentTheme.text} font-bold text-lg`}>{t('documentsVerification')}</h2>
            {kycStatus === 'VERIFIED' && <span className="bg-[#0ba259]/10 text-[#0ba259] px-2 py-1 rounded text-xs font-bold border border-[#0ba259]/20 flex items-center gap-1"><Check size={14}/> {t('verified')}</span>}
            {kycStatus === 'PENDING' && <span className="bg-orange-500/10 text-orange-500 px-2 py-1 rounded text-xs font-bold border border-orange-500/20">{t('pendingReview')}</span>}
          </div>
          
          <div className={`${currentTheme.panelBg} p-4 rounded-lg border ${currentTheme.border} text-sm`}>
             <p className={`${currentTheme.text} mb-2`}>{kycInstructions}</p>
             <p className={`${currentTheme.textMuted} text-xs`}><strong>{t('allowedDocuments')}</strong> {kycAllowedTypes}</p>
             <p className={`${currentTheme.textMuted} text-xs`}><strong>{t('allowedFormats')}</strong> {kycFormats} (Max {kycMaxSize}MB)</p>
          </div>

          
          {kycStatus !== 'VERIFIED' && kycStatus !== 'PENDING' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <label className={`relative border-2 border-dashed ${currentTheme.border} rounded-lg flex flex-col items-center justify-center p-6 hover:border-[#1e88e5] cursor-pointer transition-colors overflow-hidden`}>
                <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, setFrontImage)} />
                {frontImage ? <img src={frontImage} className="absolute inset-0 w-full h-full object-cover" alt="Front" /> : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[#1e88e5]/10 text-[#1e88e5] flex items-center justify-center mb-2">
                      <span className="text-xl">+</span>
                    </div>
                    <span className={`${currentTheme.text} font-bold text-sm`}>{t('uploadFront')}</span>
                    <span className={`${currentTheme.textMuted} text-xs mt-1`}>Max {kycMaxSize}MB</span>
                  </>
                )}
              </label>
              <label className={`relative border-2 border-dashed ${currentTheme.border} rounded-lg flex flex-col items-center justify-center p-6 hover:border-[#1e88e5] cursor-pointer transition-colors overflow-hidden`}>
                <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e, setBackImage)} />
                {backImage ? <img src={backImage} className="absolute inset-0 w-full h-full object-cover" alt="Back" /> : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[#1e88e5]/10 text-[#1e88e5] flex items-center justify-center mb-2">
                      <span className="text-xl">+</span>
                    </div>
                    <span className={`${currentTheme.text} font-bold text-sm`}>{t('uploadBack')}</span>
                    <span className={`${currentTheme.textMuted} text-xs mt-1`}>Max {kycMaxSize}MB</span>
                  </>
                )}
              </label>
            </div>
            {(frontImage || backImage) && (
              <button disabled={uploadingKyc} onClick={submitKyc} className="bg-[#1e88e5] hover:bg-[#1a7acc] text-white font-bold py-3 rounded mt-2 transition-colors cursor-pointer">
                {uploadingKyc ? t('submitting') : t('submitDocuments')}
              </button>
            )}
          </>
          )}
        </div>
        )}

        {/* Security & Preferences */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className={`${currentTheme.text} font-bold text-lg`}>{t('security')}</h2>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <ShieldCheck size={20} className="text-[#0ba259]" />
                <div className="flex flex-col">
                  <span className={`${currentTheme.text} font-bold text-sm`}>{t('twoStepVerification')}</span>
                  <span className={`${currentTheme.textMuted} text-xs flex items-center gap-1 mt-1`}>{t('receivingCodesViaEmail')} <span className="text-[#1e88e5] text-[10px] ml-1 cursor-pointer">✏️</span></span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 ml-8" onClick={() => setMfaLogin(!mfaLogin)}>
                <div className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${mfaLogin ? 'bg-[#1e88e5]' : 'bg-gray-500'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${mfaLogin ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
                <span className={`${currentTheme.text} text-sm font-bold cursor-pointer select-none`}>{t('toEnterPlatform')}</span>
              </div>
              
              <div className="flex items-center gap-3 ml-8" onClick={() => setMfaWithdraw(!mfaWithdraw)}>
                <div className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${mfaWithdraw ? 'bg-[#1e88e5]' : 'bg-gray-500'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${mfaWithdraw ? 'right-0.5' : 'left-0.5'}`}></div>
                </div>
                <span className={`${currentTheme.text} text-sm font-bold cursor-pointer select-none`}>{t('toWithdrawFunds')}</span>
              </div>
              
              <div className="flex gap-3 mt-4">
                <Lock size={20} className={`${currentTheme.textMuted}`} />
                <div className="flex flex-col">
                  <span className={`${currentTheme.text} font-bold text-sm`}>{t('password')}</span>
                  <span className={`${currentTheme.textMuted} text-xs mt-1 mb-1`}>{t('changePasswordDesc')}</span>
                  <button onClick={handleChangePassword} className="text-[#1e88e5] text-xs font-bold w-fit text-left hover:underline cursor-pointer">{t('change')}</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`flex flex-col gap-6 lg:border-l lg:${currentTheme.border} lg:pl-8`}>
             <div className="flex flex-col gap-1.5 relative">
              <label className={`${currentTheme.textMuted} text-[11px] absolute -top-2 left-2 ${currentTheme.panelBg} px-1 font-medium z-10`}>{t('language')}</label>
              <button 
                type="button"
                onClick={() => setIsLangModalOpen(true)}
                className={`w-full ${currentTheme.inputBg} border ${currentTheme.border} rounded px-3 py-2 ${currentTheme.text} text-sm flex items-center justify-between hover:border-[#1e88e5] transition-colors text-left cursor-pointer`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Globe size={15} className="text-[#1e88e5] shrink-0" />
                  <span className="truncate">{language}</span>
                </div>
                <ChevronDown size={14} className={`${currentTheme.textMuted} shrink-0`} />
              </button>
            </div>
             
            <div className="flex flex-col gap-1.5 relative">
              <label className={`${currentTheme.textMuted} text-[11px] absolute -top-2 left-2 ${currentTheme.panelBg} px-1 font-medium z-10`}>{t('timezone')}</label>
              <button 
                type="button"
                onClick={() => setIsTzModalOpen(true)}
                className={`w-full ${currentTheme.inputBg} border ${currentTheme.border} rounded px-3 py-2 ${currentTheme.text} text-sm flex items-center justify-between hover:border-[#1e88e5] transition-colors text-left cursor-pointer`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Clock size={15} className="text-[#1e88e5] shrink-0" />
                  <span className="truncate text-xs">{timezone}</span>
                </div>
                <ChevronDown size={14} className={`${currentTheme.textMuted} shrink-0`} />
              </button>
            </div>
            
            <button onClick={handleDeleteAccount} className="text-[#e33f4a] font-bold text-xs flex items-center gap-2 mt-4 hover:underline w-fit">
              <X size={14} /> {t('deleteAccount')}
            </button>
          </div>
        </div>
      </div>

      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLanguage={language}
        onSelectLanguage={setLanguage}
      />

      <TimezoneSelectorModal
        isOpen={isTzModalOpen}
        onClose={() => setIsTzModalOpen(false)}
        currentTimezone={timezone}
        onSelectTimezone={setTimezone}
      />
    </div>
  );
}
