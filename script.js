document.addEventListener('DOMContentLoaded',()=> {
const urlInput=document.querySelector('.url-input');
const generateBtn=document.querySelector('.generate-btn');
const downloadBtn=document.querySelector('.download-btn');
const clearBtn=document.querySelector('.clear-btn');
const qrPlaceholder=document.querySelector('.qr-placeholder');
const qrIcon=document.querySelector('.qr-icon');
const errorMessage=document.querySelector('.error-message');
const qrImage=document.createElement('img');
qrImage.className='qr-image';
qrImage.style.display='none';
qrPlaceholder.appendChild(qrImage);
downloadBtn.disabled=true;
function showError(m){errorMessage.textContent=m;urlInput.classList.add('error');}
function clearError(){errorMessage.textContent='';urlInput.classList.remove('error');}
function clearQR(){urlInput.value='';clearError();qrImage.src='';qrImage.style.display='none';qrIcon.style.display='block';qrPlaceholder.classList.add('shimmer');downloadBtn.disabled=true;}
function generateQRCode(){
 const url=urlInput.value.trim(); clearError();
 if(!url){showError('Please enter a URL.');return;}
 try{const p=new URL(url);if(p.protocol!=='http:'&&p.protocol!=='https:')throw Error();}
 catch{showError('Please enter a valid URL.');return;}
 generateBtn.disabled=true;generateBtn.textContent='Generating...';
 qrPlaceholder.classList.add('loading');
 qrImage.src='https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='+encodeURIComponent(url);
 qrImage.onload=()=>{qrIcon.style.display='none';qrImage.style.display='block';generateBtn.disabled=false;generateBtn.textContent='Generate QR Code';qrPlaceholder.classList.remove('loading');qrPlaceholder.classList.remove('shimmer');downloadBtn.disabled=false;};
 qrImage.onerror=()=>{showError('Failed to generate QR code.');generateBtn.disabled=false;generateBtn.textContent='Generate QR Code';qrPlaceholder.classList.remove('loading');};
}
generateBtn.addEventListener('click',generateQRCode);
urlInput.addEventListener('keypress',e=>{if(e.key==='Enter')generateQRCode();});
urlInput.addEventListener('input',clearError);
clearBtn&&clearBtn.addEventListener('click',clearQR);
downloadBtn.addEventListener('click',async()=>{
 if(!qrImage.src)return;
 try{
  const r=await fetch(qrImage.src);const b=await r.blob();
  const u=URL.createObjectURL(b);const a=document.createElement('a');
  a.href=u;a.download='qr-code.png';a.click();URL.revokeObjectURL(u);
 }catch{showError('Unable to download QR code.');}
});
});