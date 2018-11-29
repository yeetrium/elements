export function downloadState(file) {
  const fileType = file.type.split('/')[1];
  const numBytes = file.size;
  let filesize;
  
  // pulled from MDN
  for (let sizes = ["kb", "mb", "gb", "tb"],
    nMultiple = 0,
    nApprox = numBytes / 1024;
    nApprox > 1;
    nApprox /= 1024,
    nMultiple++) {
    filesize = nApprox.toFixed(0) + sizes[nMultiple];
  }  

  return `
  <div class="file-card file-card--download">
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="44" viewBox="3 1 18 22" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
      </svg>
      <span>${fileType}</span>
    </div>
    <div class="file-upload--info">
      <label>${file.name}</label>
      <div>
        <small class="filesize">${filesize} - </small>
        <small class="download"><small>${fileType}</small> Document</small>
      </div>
    </div>
    <div class="icon">
      <span class="file-card--menu">...</span>
    </div>
  </div>`;
}