
"use client";

import { useState, useRef } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark, github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import csharp from 'react-syntax-highlighter/dist/esm/languages/hljs/csharp';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import php from 'react-syntax-highlighter/dist/esm/languages/hljs/php';
import ruby from 'react-syntax-highlighter/dist/esm/languages/hljs/ruby';
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml'; // for HTML
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Loader2, Moon, Sun, Code, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Register languages for syntax highlighting
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('typescript', ts);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('html', xml);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('bash', bash);

const defaultCode = `
from reportlab.lib.pagesizes import A4
from reportlab.platypus import ( SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, Image, KeepTogether )
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.pdfgen import canvas
from datetime import datetime
import os

class WeatherStationPDFGenerator:
    """Generador mejorado de PDF para componentes de estación meteorológica"""
    def __init__(self, output_path="lista_componentes_estacion_meteorologica.pdf"):
        self.output_path = output_path
        self.doc = SimpleDocTemplate(
            self.output_path,
            pagesize=A4,
            rightMargin=20*mm,
            leftMargin=20*mm,
            topMargin=25*mm,
            bottomMargin=20*mm
        )
        self.styles = self._create_custom_styles()
        self.story = []

    def _create_custom_styles(self):
        """Crea estilos personalizados para el documento"""
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=styles['Title'],
            fontSize=18,
            spaceAfter=20,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#2C3E50"),
            fontName='Helvetica-Bold'
        ))
        styles.add(ParagraphStyle(
            name='SubTitle',
            parent=styles['Heading2'],
            fontSize=14,
            spaceAfter=12,
            spaceBefore=12,
            textColor=colors.HexColor("#34495E"),
            fontName='Helvetica-Bold'
        ))
        styles.add(ParagraphStyle(
            name='TableText',
            parent=styles['Normal'],
            fontSize=9,
            wordWrap='CJK',
            alignment=TA_JUSTIFY,
            leading=11
        ))
        styles.add(ParagraphStyle(
            name='InfoText',
            parent=styles['Normal'],
            fontSize=10,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
            leading=12
        ))
        return styles

    def _add_header_footer(self):
        """Añade encabezado y pie de página personalizado"""
        def header_footer(canvas, doc):
            canvas.saveState()
            canvas.setFont('Helvetica-Bold', 10)
            canvas.setFillColor(colors.HexColor("#7F8C8D"))
            canvas.drawString(20*mm, A4[1] - 15*mm, "Proyecto: Mini Estación Meteorológica")
            canvas.setFont('Helvetica', 8)
            canvas.drawRightString(A4[0] - 20*mm, 10*mm, f"Página {doc.page}")
            canvas.drawString(20*mm, 10*mm, f"Generado el: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
            canvas.restoreState()
        return header_footer

    def add_title_section(self):
        """Añade la sección de título con información del proyecto"""
        title = Paragraph(
            "Lista de Componentes<br/>Mini Estación Meteorológica con Arduino Nano",
            self.styles["CustomTitle"]
        )
        self.story.append(title)
        self.story.append(Spacer(1, 15))
        project_info = Paragraph(
            """
            Descripción del Proyecto:<br/>
            Esta mini estación meteorológica basada en Arduino Nano es capaz de medir temperatura, 
            humedad y luminosidad ambiental, mostrando los datos en tiempo real a través de una 
            pantalla OLED. El sistema es portátil, alimentado por batería y diseñado para uso 
            educativo y de monitoreo básico.
            """,
            self.styles["InfoText"]
        )
        self.story.append(project_info)
        self.story.append(Spacer(1, 20))

    def add_components_table(self):
        """Crea y añade la tabla de componentes mejorada"""
        subtitle = Paragraph("Componentes Requeridos", self.styles["SubTitle"])
        self.story.append(subtitle)
        data = [
            ["N°", "Componente", "Cant.", "Descripción", "Especificaciones"],
            ["1", "Arduino Nano", "1", Paragraph("Placa de desarrollo compacta para control del sistema", self.styles["TableText"]), Paragraph("ATmega328P, 5V/16MHz, 14 I/O digitales", self.styles["TableText"])],
            ["2", "Sensor DHT22", "1", Paragraph("Sensor digital de temperatura y humedad de alta precisión", self.styles["TableText"]), Paragraph("±0.5°C, ±2% HR, 3.3-6V", self.styles["TableText"])],
            ["3", "Fotocelda LDR", "1", Paragraph("Sensor de luminosidad para medición de intensidad lumínica", self.styles["TableText"]), Paragraph("GL5528, 5-50kΩ, 550nm pico", self.styles["TableText"])],
            ["4", "Resistencia 10kΩ", "1", Paragraph("Resistencia de precisión para divisor de tensión del LDR", self.styles["TableText"]), Paragraph("1/4W, ±5% tolerancia", self.styles["TableText"])],
            ["5", "Pantalla OLED", "1", Paragraph("Display gráfico monocromático con interfaz I²C", self.styles["TableText"]), Paragraph("0.96\", 128x64px, SSD1306", self.styles["TableText"])],
            ["6", "Batería 9V", "1", Paragraph("Fuente de alimentación alcalina desechable", self.styles["TableText"]), Paragraph("Tipo PP3, ~550mAh", self.styles["TableText"])],
            ["7", "Conector batería", "1", Paragraph("Clip de conexión para batería de 9V con cables", self.styles["TableText"]), Paragraph("Cable 15cm, terminales", self.styles["TableText"])],
            ["8", "Interruptor", "1", Paragraph("Switch de encendido/apagado para el circuito", self.styles["TableText"]), Paragraph("SPST, 250V/3A, montaje", self.styles["TableText"])],
            ["9", "Cables jumper", "20", Paragraph("Cables de conexión para protoboard", self.styles["TableText"]), Paragraph("M-M y M-F, 20cm longitud", self.styles["TableText"])],
            ["10", "Protoboard", "1", Paragraph("Placa de pruebas para montaje temporal", self.styles["TableText"]), Paragraph("400 puntos, half-size", self.styles["TableText"])],
            ["11", "Caja protección", "1", Paragraph("Carcasa plástica para protección de componentes", self.styles["TableText"]), Paragraph("IP54, ABS, ventilación", self.styles["TableText"])],
        ]
        table = Table(data, colWidths=[20*mm, 35*mm, 15*mm, 60*mm, 50*mm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#3498DB")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 8),
            ('ALIGN', (0, 0), (2, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#BDC3C7")),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8F9FA")]),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 4),
            ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ]))
        self.story.append(KeepTogether(table))
        self.story.append(Spacer(1, 20))

    def add_additional_info(self):
        """Añade información adicional sobre el proyecto"""
        notes_title = Paragraph("Notas Importantes", self.styles["SubTitle"])
        self.story.append(notes_title)
        notes_content = Paragraph(
            """
            • Alimentación: El sistema consume aproximadamente 50-70mA durante operación normal.<br/>
            • Conexiones: Utilizar cables de buena calidad para evitar lecturas erróneas.<br/>
            • Calibración: El sensor DHT22 puede requerir un período de estabilización de 2-3 minutos.<br/>
            • Protección: Evitar exposición directa a lluvia o humedad extrema.<br/>
            • Mantenimiento: Verificar conexiones periódicamente y limpiar sensores suavemente.
            """,
            self.styles["InfoText"]
        )
        self.story.append(notes_content)
        self.story.append(Spacer(1, 15))
        cost_title = Paragraph("Costo Estimado del Proyecto", self.styles["SubTitle"])
        self.story.append(cost_title)
        cost_content = Paragraph(
            """
            El costo total aproximado de este proyecto varía entre $25-40 USD dependiendo del 
            proveedor y la calidad de los componentes. Se recomienda adquirir componentes de 
            proveedores confiables para garantizar la durabilidad y precisión del sistema.
            """,
            self.styles["InfoText"]
        )
        self.story.append(cost_content)

    def generate_pdf(self):
        """Genera el PDF completo"""
        try:
            self.add_title_section()
            self.add_components_table()
            self.add_additional_info()
            self.doc.build(
                self.story,
                onFirstPage=self._add_header_footer(),
                onLaterPages=self._add_header_footer()
            )
            print(f"✅ PDF generado exitosamente: {self.output_path}")
            return self.output_path
        except Exception as e:
            print(f"❌ Error al generar el PDF: {str(e)}")
            return None

def main():
    """Función principal para ejecutar el generador"""
    generator = WeatherStationPDFGenerator("lista_componentes_estacion_meteorologica_mejorada.pdf")
    pdf_path = generator.generate_pdf()
    if pdf_path and os.path.exists(pdf_path):
        file_size = os.path.getsize(pdf_path) / 1024 # Tamaño en KB
        print(f"📄 Archivo generado: {pdf_path}")
        print(f"📏 Tamaño del archivo: {file_size:.1f} KB")

if __name__ == "__main__":
    main()
`.trim();


export default function CodeToPdf() {
    const [code, setCode] = useState<string>(defaultCode);
    const [fontSize, setFontSize] = useState<number>(14);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("code");


    const previewRef = useRef<HTMLDivElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    const getIframeBody = (iframe: HTMLIFrameElement) => {
        return iframe.contentDocument?.body;
    }

    const handleGeneratePdf = async () => {
        const elementToCapture = activeTab === 'code' ? previewRef.current : (outputRef.current ? getIframeBody(outputRef.current.querySelector('iframe')!) : null);
        
        if (!elementToCapture || (activeTab === 'code' && !code.trim())) {
            toast({
                title: "Error",
                description: activeTab === 'code' ? "Cannot generate PDF. Please enter some code." : "Cannot generate PDF. Output not available.",
                variant: "destructive",
            });
            return;
        }

        setIsGenerating(true);
        try {
            const canvas = await html2canvas(elementToCapture, {
                useCORS: true,
                scale: 2,
                // Allow scripts so that chart libraries can render
                allowTaint: true,
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: orientation,
                unit: 'px',
                format: 'a4',
                hotfixes: ['px_scaling'],
            });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgWidth / imgHeight;

            let newImgWidth = pdfWidth - 20; // with padding
            let newImgHeight = newImgWidth / ratio;
            if (newImgHeight > pdfHeight - 20) {
                newImgHeight = pdfHeight - 20;
                newImgWidth = newImgHeight * ratio;
            }
            const x = (pdfWidth - newImgWidth) / 2;
            const y = (pdfHeight - newImgHeight) / 2;
            pdf.addImage(imgData, 'PNG', x, y, newImgWidth, newImgHeight);
            pdf.save(`${activeTab}-output.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast({
                title: "PDF Generation Failed",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleThemeChange = (checked: boolean) => {
        const newTheme = checked ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', checked);
    };

    const highlighterStyle = theme === 'light' ? github : atomOneDark;
    const previewBg = theme === 'light' ? 'bg-[#f6f8fa]' : 'bg-[#282c34]';
    const outputBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';

    return (
        <div className="min-h-screen flex flex-col">
            <header className="text-center py-8">
                <h1 className="text-4xl lg:text-5xl font-bold font-headline tracking-tight">Code2PDF</h1>
                <p className="text-muted-foreground mt-2 text-lg">Convert your code snippets into beautiful, shareable PDFs.</p>
            </header>
            <main className="container mx-auto p-4 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">Your Code</CardTitle>
                                <CardDescription>Paste your code here. HTML/JS is rendered in the Output tab.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Paste your code here..."
                                    className="h-96 font-code text-sm rounded-md transition-shadow duration-300 focus:shadow-outline"
                                    rows={20}
                                />
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">Settings</CardTitle>
                                <CardDescription>Customize the look of your PDF.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="theme-switch" className="font-medium">Theme</Label>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Sun className="h-5 w-5" />
                                        <Switch
                                            id="theme-switch"
                                            checked={theme === 'dark'}
                                            onCheckedChange={handleThemeChange}
                                        />
                                        <Moon className="h-5 w-5" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-medium">Font Size (Code): <span className="text-primary font-semibold">{fontSize}px</span></Label>
                                    <Slider
                                        value={[fontSize]}
                                        onValueChange={(value) => setFontSize(value[0])}
                                        min={8}
                                        max={24}
                                        step={1}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="font-medium">PDF Layout</Label>
                                    <RadioGroup
                                        value={orientation}
                                        onValueChange={(value: 'portrait' | 'landscape') => setOrientation(value)}
                                        className="flex gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="portrait" id="portrait" />
                                            <Label htmlFor="portrait">Portrait</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="landscape" id="landscape" />
                                            <Label htmlFor="landscape">Landscape</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-3">
                        <Card className="shadow-lg h-full flex flex-col">
                           <CardHeader>
                                <div className="flex items-center justify-between">
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <div className="flex items-center justify-between border-b">
                                        <TabsList>
                                            <TabsTrigger value="code"><Code className="mr-2 h-4 w-4"/>Code</TabsTrigger>
                                            <TabsTrigger value="output"><Eye className="mr-2 h-4 w-4"/>Output</TabsTrigger>
                                        </TabsList>
                                         <Button onClick={handleGeneratePdf} disabled={isGenerating} size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                                            {isGenerating ? (
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            ) : (
                                                <Download className="mr-2 h-5 w-5" />
                                            )}
                                            Download PDF
                                        </Button>
                                    </div>
                                    <CardContent className="flex-grow p-4 md:p-6 mt-4">
                                        <TabsContent value="code">
                                            <div ref={previewRef} className={`p-6 rounded-lg overflow-auto transition-all duration-300 ${previewBg}`}>
                                                <SyntaxHighlighter
                                                    language="python"
                                                    className="font-code"
                                                    style={highlighterStyle}
                                                    showLineNumbers
                                                    wrapLines={true}
                                                    lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
                                                    customStyle={{
                                                        fontSize: `${fontSize}px`,
                                                        margin: 0,
                                                        backgroundColor: 'transparent',
                                                        transition: 'font-size 0.3s ease',
                                                    }}
                                                    codeTagProps={{
                                                        className: "font-code"
                                                    }}
                                                >
                                                    {code}
                                                </SyntaxHighlighter>
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="output">
                                            <div ref={outputRef} className={`p-1 rounded-lg overflow-hidden transition-all duration-300 ${outputBg}`}>
                                                 <iframe
                                                    srcDoc={code}
                                                    title="output"
                                                    sandbox="allow-scripts"
                                                    frameBorder="0"
                                                    width="100%"
                                                    height="500px"
                                                    className="rounded-md"
                                                  />
                                            </div>
                                        </TabsContent>
                                    </CardContent>
                                 </Tabs>
                                </div>
                           </CardHeader>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );

    