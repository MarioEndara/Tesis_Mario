import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Importamos la función directamente

export const generarActaMatrimonio = (data) => {
    const doc = new jsPDF();
    const logoUrl = '/assets/encabezado.png';

    // 1. Agregar Encabezado
    // Intentamos cargar la imagen (si da error, el PDF seguirá adelante con el texto)
    try {
        doc.addImage(logoUrl, 'PNG', 15, 10, 180, 40);
    } catch (e) {
        console.warn("No se pudo cargar el logo, generando solo texto.");
    }

    // 2. Título
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("ACTA DE MATRIMONIO", 105, 65, { align: "center" });

    // 3. Cuerpo
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Certificamos que en los archivos parroquiales consta el matrimonio de:", 20, 80);

    // 4. TABLA DE DATOS (Aquí está el cambio de la función)
    autoTable(doc, { // <-- Usamos autoTable(doc, {...}) en lugar de doc.autoTable
        startY: 90,
        theme: 'grid',
        body: [
            ['Esposo:', `${data.nombreEsposo} ${data.apellidoEsposo}`],
            ['Cédula Esposo:', data.cedulaEsposo],
            ['Esposa:', `${data.nombreEsposa} ${data.apellidoEsposa}`],
            ['Cédula Esposa:', data.cedulaEsposa],
            ['Fecha:', new Date(data.fechaMatrimonio).toLocaleDateString()],
            ['Celebrante:', data.celebrante],
            ['Libro/Tomo/Pág:', `${data.libro} / ${data.tomo} / ${data.pagina}`],
            ['Testigos:', data.testigos],
        ],
        styles: { fontSize: 11 }
    });

    // 5. Firmas
    const finalY = doc.lastAutoTable.finalY + 35;
    doc.line(60, finalY, 150, finalY);
    doc.text("Párroco / Secretario", 105, finalY + 7, { align: "center" });

    // 6. Descargar
    doc.save(`Acta_Matrimonio_${data.apellidoEsposo}.pdf`);
};

// BAUTISMO

export const generarActaBautismo = (data) => {
    const doc = new jsPDF();
    const logoUrl = '/assets/encabezado.png';

    try {
        doc.addImage(logoUrl, 'PNG', 15, 10, 180, 40);
    } catch (e) {
        console.warn("Logo no encontrado");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("FE DE BAUTISMO", 105, 65, { align: "center" });

    autoTable(doc, {
        startY: 85,
        theme: 'grid',
        body: [
            ['Bautizado/a:', `${data.nombreNiño} ${data.apellidoNiño}`],
            ['Cédula:', data.cedulaNiño],
            ['Fecha de Nacimiento:', data.fechaNacimiento ? new Date(data.fechaNacimiento).toLocaleDateString() : 'S/F'],
            ['Fecha de Bautismo:', data.fechaBautismo ? new Date(data.fechaBautismo).toLocaleDateString() : 'S/F'],
            ['Padre:', data.nombrePadre],
            ['Madre:', data.nombreMadre],
            ['Padrinos:', `${data.padrino} y ${data.madrina}`],
            ['Sacerdote:', data.celebrante],
            ['Libro / Tomo / Pág:', `${data.libro} / ${data.tomo} / ${data.pagina}`],
        ],
        styles: { fontSize: 11, cellPadding: 4 }
    });

    const finalY = doc.lastAutoTable.finalY + 30;
    doc.line(60, finalY, 150, finalY);
    doc.text("Párroco / Secretario", 105, finalY + 7, { align: "center" });

    doc.save(`Fe_Bautismo_${data.apellidoNiño}.pdf`);
};
//Catequesis

export const generarCertificadoCatequesis = (data) => {
    const doc = new jsPDF();
    const logoUrl = '/assets/encabezado.png';

    try {
        doc.addImage(logoUrl, 'PNG', 15, 10, 180, 40);
    } catch (e) {
        console.warn("Logo no encontrado");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("CERTIFICADO DE INSCRIPCIÓN - CATEQUESIS", 105, 65, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("La Parroquia San Ignacio de Loyola certifica la inscripción de:", 20, 80);

    autoTable(doc, {
        startY: 85,
        theme: 'grid',
        body: [
            ['Estudiante:', `${data.nombreEstudiante} ${data.apellidoEstudiante}`],
            ['Cédula:', data.cedulaEstudiante],
            ['Nivel de Catequesis:', data.nivel],
            ['Representante:', data.nombreRepresentante],
            ['Fecha de Inscripción:', data.fechaInscripcion ? new Date(data.fechaInscripcion).toLocaleDateString() : new Date().toLocaleDateString()],
        ],
        styles: { fontSize: 11, cellPadding: 5 }
    });

    const finalY = doc.lastAutoTable.finalY + 30;
    doc.line(60, finalY, 150, finalY);
    doc.text("Firma del Catequista / Secretaría", 105, finalY + 7, { align: "center" });

    doc.save(`Inscripcion_Catequesis_${data.apellidoEstudiante}.pdf`);
};