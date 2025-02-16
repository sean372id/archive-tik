let ratioWidth = document.getElementById('ratio-width'); 
        let ratioHeight = document.getElementById('ratio-height'); 
        let width = document.getElementById('width');
        let height = document.getElementById('height');
        let diagonal = document.getElementById('diagonal');
        let toggleModeBtn = document.getElementById('toggle-mode');
        let modeText = document.getElementById('mode-text');

        let mode = "ratio"; // Default mode

        let formatNumber = (num) => {
            let formatted = parseFloat(num).toFixed(2);
            return formatted.endsWith(".00") ? parseInt(num) : formatted;
        };

        let calculateWidth = () => {
            if (mode === "ratio") {
                let aspectRatio = ratioWidth.value / ratioHeight.value;
                width.value = formatNumber(height.value * aspectRatio);
            }
            calculateDiagonal();
        };

        let calculateHeight = () => {
            if (mode === "ratio") {
                let aspectRatio = ratioWidth.value / ratioHeight.value;
                height.value = formatNumber(width.value / aspectRatio);
            }
            calculateDiagonal();
        };

        let calculateDiagonal = () => {
            let w = parseFloat(width.value);
            let h = parseFloat(height.value);
            if (!isNaN(w) && !isNaN(h)) {
                diagonal.value = formatNumber(Math.sqrt(w * w + h * h) / 96); // 1 inci = 96 pixel (asumsi)
            }
        };

        let calculateScreenSize = () => {
            if (mode === "screen") {
                let aspectRatio = ratioWidth.value / ratioHeight.value;
                let factor = Math.sqrt(1 + (1 / (aspectRatio * aspectRatio)));
                height.value = formatNumber(diagonal.value * 96 / factor);
                width.value = formatNumber(height.value * aspectRatio);
            }
        };

        height.addEventListener('input', calculateWidth); 
        width.addEventListener('input', calculateHeight); 
        ratioWidth.addEventListener('input', () => {
            calculateHeight();
            calculateWidth();
        });
        ratioHeight.addEventListener('input', () => {
            calculateHeight();
            calculateWidth();
        });
        diagonal.addEventListener('input', calculateScreenSize);

        toggleModeBtn.addEventListener('click', () => {
            if (mode === "ratio") {
                mode = "screen";
                diagonal.disabled = false;
                width.disabled = true;
                height.disabled = true;
                modeText.textContent = "Ukuran Layar";
                toggleModeBtn.textContent = "Gunakan Aspek Rasio";
            } else {
                mode = "ratio";
                diagonal.disabled = true;
                width.disabled = false;
                height.disabled = false;
                modeText.textContent = "Aspek Rasio";
                toggleModeBtn.textContent = "Gunakan Ukuran Layar";
            }
        });

        function setInputValue(a, b, x, y) {
            ratioWidth.value = a;
            ratioHeight.value = b;
            width.value = x;
            height.value = y;
            calculateDiagonal();
        }