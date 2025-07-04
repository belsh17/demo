//code for pdf conversion and download
    async function downloadPDF() {
        const form = document.getElementById("template-form");
        const downloadBtn = document.getElementById("pdf-btn");
        const loadingIndicator = document.getElementById("loading-indicator");

         let wrapper = null;

        downloadBtn.disabled = true;
        loadingIndicator.style.display = "inline";

        try{
        //const templateName = form.getAttribute("data-template-name") || "Template";
       
            //commmneted out bottom to test top
        const templateName = form.querySelector("h2, h3")?.textContent || "Template";
        //use html2canvas to capture form as image
        // const canvas = await html2canvas(form, { scale: 2});
        // const imgData = canvas.toDataURL("image/png");

        const landscapeTemplates = [
            "Regulation Obligation Tracker",
            "Tax compliance tracker",
            "Staff Hours",
            "Semester Planner",
            "Weekly Work Schedule",
            "RAID Log",
            "Change Log",
            "Test/Issue Log"
        ];
        const isLandscape = landscapeTemplates.some(name => 
            templateName.toLowerCase().includes(name.toLowerCase())
        );
        
        // let wrapper = null;
        //applies temp landscape style
        if(isLandscape){
            form.classList.add("landscape-mode");

            wrapper = document.createElement("div");
            wrapper.style.position = "relative";
            wrapper.style.width = `${form.offsetWidth * 0.75}px`;
            wrapper.style.overflow = "hidden";
            form.parentNode.insertBefore(wrapper, form);
            wrapper.appendChild(form);
        }

        //ADDED FOR TABLE OVERFLOW
        const originalWidth = form.style.width;
        const originalOverflow = form.style.overflow;

        form.style.overflow = "visible";
        form.style.width = form.scrollWidth + "px";
        //END OF ADDED

        //wait for DOM to apply changes
        await new Promise(resolve => setTimeout(resolve, 200));

        //use html2canvas to capture form as image
        const canvas = await html2canvas(form, { 
            scale: 3,
            useCORS: true
            // width: form.scrollWidth,
            // height: form.scrollHeight
        });

        //ADED FOR TABLE OVERFLOW
        form.style.width = originalWidth;
        form.style.overflow = originalOverflow;
        //END OF ADDED
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
        // const imgWidth = pageWidth - 40;
        // const imgHeight = canvas.height * imgWidth / canvas.width;
        //TESTING BOTTOM TO FIT TO PAGE
        const margin = 20;

        let imgWidth = pageWidth - 2 * margin;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;

        if(imgHeight > pageHeight - 2 * margin){
            imgHeight = pageHeight - 2 * margin;
            imgWidth = (canvas.width * imgHeight) / canvas.height;
        }
        //END OF TESTING

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

                console.log({pageWidth, 
                            pageHeight,
                            canvasHeight: canvas.height,
                            canvasWidth: canvas.width,
                            imgWidth,
                            imgHeight});

                pdf.addImage(img, "PNG", 20, 20, imgWidth, pageHeight - 40);

                y += pageCanvasHeight;

                if(y < canvas.height){
                    pdf.addPage();
                }
           }
        }

            //pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
            pdf.save(`${templateName.replace(/\s+/g, "_")}.pdf`);

            // if(isLandscape){
            //     form.classList.remove("landscape-mode");
            // }
        }catch (error){
            console.error("Error generating PDF:", error);
            alert("There was a problem generating the PDF.");
        }finally{
            downloadBtn.disabled = false;
            loadingIndicator.style.display = "none";

            if(form.classList.contains("landscape-mode")){
                form.classList.remove("landscape-mode");

                if(wrapper && wrapper.parentNode){
                    wrapper.parentNode.insertBefore(form, wrapper);
                    wrapper.remove();
                }
            }
        }
    }