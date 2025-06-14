//code for pdf conversion and download
    async function downloadPDF() {
        const form = document.getElementById("template-form");
        const downloadBtn = document.getElementById("pdf-btn");
        const loadingIndicator = document.getElementById("loading-indicator");

        downloadBtn.disabled = true;
        loadingIndicator.style.display = "inline";

        try{
        const templateName = form.querySelector("h2, h3")?.textContent || "Template";
        //use html2canvas to capture form as image
        // const canvas = await html2canvas(form, { scale: 2});
        // const imgData = canvas.toDataURL("image/png");

        const landscapeTemplates = [
            "Regulation Obligation Tracker",
            "Tax Compliance Tracker",
            "Staff Hours",
            "Semester Planner",
            "Weekly Work Schedule",
            "RAID Log",
            "Change Log",
            "Test/Issue Log"
        ];
        const isLandscape = landscapeTemplates.some(name => templateName.includes(name));
        
        //applies temp landscape style
        if(isLandscape){
            form.classList.add("landscape-mode");
        }

        //wait for DOM to apply changes
        await new Promise(resolve => setTimeout(resolve, 100));

        //use html2canvas to capture form as image
        const canvas = await html2canvas(form, { scale: 3});
        const imgData = canvas.toDataURL("image/png");

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            //asks if it is ladnscape according to templates defined as landscape
            orientation: isLandscape ? 'landscape' : 'portrait',
            unit: 'pt',
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        //fit image to page
        const imgWidth = pageWidth - 40;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        let position = 20;

        //check to see if content fits 1 page
        if(imgHeight <= pageHeight - 40){
            pdf.addImage(imgData, "PNG", 20, position, imgWidth, imgHeight);
        }else{
            //multi page logic
            let y = 0;
            const pageCanvas = document.createElement("canvas");
            const pageCtx = pageCanvas.getContext("2d");


            //const pageCanvasHeight = Math.floor(canvas.width * (pageHeight - 40) / (pageWidth - 40));
            const scale = canvas.width / pageWidth;
            const pageCanvasHeight = Math.floor((pageHeight - 40) * scale);

            pageCanvas.width = canvas.width;
            pageCanvas.height = pageCanvasHeight;

            while(y < canvas.height){
                pageCtx.clearRect(0,0,pageCanvas.width, pageCanvas.height);
                pageCtx.drawImage(canvas, 0 ,y, canvas.width, pageCanvasHeight, 0, 0, canvas.width, pageCanvasHeight);
                const img = pageCanvas.toDataURL("image/png");

                pdf.addImage(img, "PNG", 20, 20, imgWidth, pageHeight - 40);

                y += pageCanvasHeight;

                if(y < canvas.height){
                    pdf.addPage();
                }
           }
        }

            //pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
            pdf.save(`${templateName.replace(/\s+/g, "_")}.pdf`);

            if(isLandscape){
                form.classList.remove("landscape-mode");
            }
        }catch (error){
            console.error("Error generating PDF:", error);
            alert("There was a problem generating the PDF.");
        }finally{
            downloadBtn.disabled = false;
            loadingIndicator.style.display = "none";
        }
    }