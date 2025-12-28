(() => {
  const menuUrlInput = document.getElementById("menuUrl");
  const qrImage = document.getElementById("qrImage");
  const qrLink = document.getElementById("qrLink");
  const useLocal = document.getElementById("useLocal");
  const copyUrl = document.getElementById("copyUrl");
  const printQr = document.getElementById("printQr");
  const menuLink = document.querySelector(".ghost-link");

  const startScan = document.getElementById("startScan");
  const stopScan = document.getElementById("stopScan");
  const video = document.getElementById("video");
  const scanStatus = document.getElementById("scanStatus");
  const scanResult = document.getElementById("scanResult");
  const scanLink = document.getElementById("scanLink");
  const fileScan = document.getElementById("fileScan");

  let scanTimer = null;
  let stream = null;
  let detector = null;

  const fallbackMenuUrl = "https://qr-scan-livid.vercel.app/";

  const buildLocalUrl = () => {
    try {
      const baseUrl = new URL("menu.html", window.location.href);
      const host = baseUrl.hostname;

      if (host === "127.0.0.1" || host === "localhost") {
        return fallbackMenuUrl;
      }

      return baseUrl.toString();
    } catch (err) {
      return fallbackMenuUrl;
    }
  };

  const isUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch (err) {
      return false;
    }
  };

  const updateQr = () => {
    const input = menuUrlInput.value.trim();
    const safeUrl = input || buildLocalUrl();

    if (!safeUrl) {
      qrImage.removeAttribute("src");
      qrLink.textContent = "Add a menu URL to generate a QR.";
      return;
    }

    const qrService = "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=";
    qrImage.src = qrService + encodeURIComponent(safeUrl);
    qrLink.textContent = safeUrl;

    if (menuLink) {
      menuLink.href = safeUrl;
    }
  };

  const setMenuUrl = (value) => {
    menuUrlInput.value = value;
    updateQr();
  };

  const setStatus = (text) => {
    scanStatus.textContent = text;
  };

  const setResult = (text) => {
    scanResult.textContent = text;
  };

  const setLink = (value) => {
    if (value && isUrl(value)) {
      scanLink.href = value;
      scanLink.classList.add("show");
    } else {
      scanLink.href = "#";
      scanLink.classList.remove("show");
    }
  };

  const handleScan = (value) => {
    setResult(value);
    setLink(value);
    setStatus("QR detected.");

    if (isUrl(value)) {
      window.open(value, "_blank", "noopener");
    }
  };

  const stopScanner = () => {
    if (scanTimer) {
      clearTimeout(scanTimer);
      scanTimer = null;
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }

    detector = null;
    video.srcObject = null;
    startScan.disabled = false;
    stopScan.disabled = true;
    setStatus("Scanner stopped.");
  };

  const scanFrame = async () => {
    if (!detector) {
      return;
    }

    if (!video.videoWidth) {
      scanTimer = setTimeout(scanFrame, 250);
      return;
    }

    let bitmap = null;

    try {
      bitmap = await createImageBitmap(video);
      const codes = await detector.detect(bitmap);

      if (codes.length > 0) {
        handleScan(codes[0].rawValue || "");
        stopScanner();
        return;
      }
    } catch (err) {
      setStatus("Scan error: " + err.message);
      stopScanner();
      return;
    } finally {
      if (bitmap && bitmap.close) {
        bitmap.close();
      }
    }

    scanTimer = setTimeout(scanFrame, 250);
  };

  useLocal.addEventListener("click", () => {
    setMenuUrl(buildLocalUrl());
  });

  menuUrlInput.addEventListener("input", updateQr);

  copyUrl.addEventListener("click", async () => {
    const url = menuUrlInput.value.trim();

    if (!url) {
      setStatus("Add a menu URL first.");
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setStatus("Menu URL copied.");
    } catch (err) {
      setStatus("Copy failed. You can select and copy the URL.");
    }
  });

  printQr.addEventListener("click", () => {
    window.print();
  });

  startScan.addEventListener("click", async () => {
    if (!("BarcodeDetector" in window)) {
      setStatus("BarcodeDetector is not supported in this browser.");
      return;
    }

    try {
      detector = new BarcodeDetector({ formats: ["qr_code"] });
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      video.srcObject = stream;
      await video.play();
      setStatus("Point the camera at a QR code.");
      startScan.disabled = true;
      stopScan.disabled = false;
      scanFrame();
    } catch (err) {
      setStatus("Camera error: " + err.message);
      stopScanner();
    }
  });

  stopScan.addEventListener("click", stopScanner);

  fileScan.addEventListener("change", async (event) => {
    if (!("BarcodeDetector" in window)) {
      setStatus("BarcodeDetector is not supported in this browser.");
      return;
    }

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    let bitmap = null;

    try {
      detector = new BarcodeDetector({ formats: ["qr_code"] });
      bitmap = await createImageBitmap(file);
      const codes = await detector.detect(bitmap);

      if (codes.length > 0) {
        handleScan(codes[0].rawValue || "");
      } else {
        setStatus("No QR code found in the image.");
        setResult("No code yet.");
        setLink("");
      }
    } catch (err) {
      setStatus("Image scan error: " + err.message);
    } finally {
      if (bitmap && bitmap.close) {
        bitmap.close();
      }
    }
  });

  setMenuUrl(fallbackMenuUrl);
})();
