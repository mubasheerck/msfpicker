// Function to show toast notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');

    let toastIcon = 'info';
    if(type === 'error') {
        toastIcon = 'error';
    } else if(type === 'success') {
        toastIcon = 'done_all';
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = document.createElement('span');
    icon.className = 'material-symbols';
    icon.textContent = toastIcon;
    toast.append(icon, message);    

    // toast.textContent = message;

    toastContainer.appendChild(toast);

    // Show the toast
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);

    // Hide and remove after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 5000);
}

// Function to extract the URL from CSS text
function extractFontUrlFromCss(cssText) {
    cssText = String(cssText);
    const urlRegex = /src:\s*url\((.*?)\)/;
    const match = cssText.match(urlRegex);
    return match ? match[1] : null;
}

// Function to fetch and download the font file
function downloadFontFromUrl(url, filename = 'material-icons.woff2') {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => {
            // Create a temporary URL for the blob
            const downloadUrl = window.URL.createObjectURL(blob);

            // Create an anchor element and set properties for download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;

            // Append to the document, click it, and clean up
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Release the blob URL
            window.URL.revokeObjectURL(downloadUrl);

            // Show success toast instead of console log
            showToast('Font file download initiated!', 'info');

            return 'Download complete';
        })
        .catch(error => {
            // Show error toast instead of console error
            showToast(`Error downloading the font: ${error.message}`, 'error');
            throw error;
        });
}

// When getting the stylesheet as a response
function processStylesheetResponse(response) {
    if (!response.ok) {
        showToast(`HTTP error! Status: ${response.status}`, 'error');
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.text()
        .then(stylesheetText => {
            const fontUrl = extractFontUrlFromCss(stylesheetText);

            if (fontUrl) {
                showToast('Found font URL, starting download...', 'info');
                return downloadFontFromUrl(fontUrl);
            } else {
                showToast('No font URL found in the stylesheet', 'error');
                throw new Error('No font URL found');
            }
        });
}