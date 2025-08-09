
"use client";

import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Download, Loader2, Moon, Sun, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const defaultCode = `
<style>
    body {
        font-family: Helvetica, Arial, sans-serif;
        font-size: 10px;
        line-height: 1.4;
        color: #333;
    }
    .custom-title {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        color: #2C3E50;
        margin-bottom: 20px;
    }
    .subtitle {
        font-size: 14px;
        font-weight: bold;
        color: #34495E;
        margin-top: 12px;
        margin-bottom: 12px;
        border-bottom: 1px solid #ccc;
        padding-bottom: 4px;
    }
    .info-text {
        font-size: 10px;
        text-align: justify;
        line-height: 1.2;
        margin-bottom: 6px;
    }
    .project-description {
        margin-bottom: 20px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 9px;
    }
    th, td {
        border: 1px solid #BDC3C7;
        padding: 6px 4px;
        text-align: left;
        vertical-align: top;
        word-wrap: break-word;
    }
    thead th {
        background-color: #3498DB;
        color: white;
        font-weight: bold;
        font-size: 10px;
    }
    tbody tr:nth-child(even) {
        background-color: #F8F9FA;
    }
    .text-center {
      text-align: center;
    }
    .notes-list {
        padding-left: 20px;
        margin-bottom: 15px;
    }
</style>
<body>
    <div class="custom-title">
        Lista de Componentes<br/>Mini Estación Meteorológica con Arduino Nano
    </div>
    
    <div class="project-description info-text">
        <strong>Descripción del Proyecto:</strong><br/>
        Esta mini estación meteorológica basada en Arduino Nano es capaz de medir temperatura, 
        humedad y luminosidad ambiental, mostrando los datos en tiempo real a través de una 
        pantalla OLED. El sistema es portátil, alimentado por batería y diseñado para uso 
        educativo y de monitoreo básico.
    </div>

    <div class="subtitle">Componentes Requeridos</div>
    <table>
        <thead>
            <tr>
                <th class="text-center">N°</th>
                <th>Componente</th>
                <th class="text-center">Cant.</th>
                <th>Descripción</th>
                <th>Especificaciones</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="text-center">1</td>
                <td>Arduino Nano</td>
                <td class="text-center">1</td>
                <td>Placa de desarrollo compacta para control del sistema</td>
                <td>ATmega328P, 5V/16MHz, 14 I/O digitales</td>
            </tr>
            <tr>
                <td class="text-center">2</td>
                <td>Sensor DHT22</td>
                <td class="text-center">1</td>
                <td>Sensor digital de temperatura y humedad de alta precisión</td>
                <td>±0.5°C, ±2% HR, 3.3-6V</td>
            </tr>
            <tr>
                <td class="text-center">3</td>
                <td>Fotocelda LDR</td>
                <td class="text-center">1</td>
                <td>Sensor de luminosidad para medición de intensidad lumínica</td>
                <td>GL5528, 5-50kΩ, 550nm pico</td>
            </tr>
            <tr>
                <td class="text-center">4</td>
                <td>Resistencia 10kΩ</td>
                <td class="text-center">1</td>
                <td>Resistencia de precisión para divisor de tensión del LDR</td>
                <td>1/4W, ±5% tolerancia</td>
            </tr>
            <tr>
                <td class="text-center">5</td>
                <td>Pantalla OLED</td>
                <td class="text-center">1</td>
                <td>Display gráfico monocromático con interfaz I²C</td>
                <td>0.96", 128x64px, SSD1306</td>
            </tr>
            <tr>
                <td class="text-center">6</td>
                <td>Batería 9V</td>
                <td class="text-center">1</td>
                <td>Fuente de alimentación alcalina desechable</td>
                <td>Tipo PP3, ~550mAh</td>
            </tr>
            <tr>
                <td class="text-center">7</td>
                <td>Conector batería</td>
                <td class="text-center">1</td>
                <td>Clip de conexión para batería de 9V con cables</td>
                <td>Cable 15cm, terminales</td>
            </tr>
            <tr>
                <td class="text-center">8</td>
                <td>Interruptor</td>
                <td class="text-center">1</td>
                <td>Switch de encendido/apagado para el circuito</td>
                <td>SPST, 250V/3A, montaje</td>
            </tr>
            <tr>
                <td class="text-center">9</td>
                <td>Cables jumper</td>
                <td class="text-center">20</td>
                <td>Cables de conexión para protoboard</td>
                <td>M-M y M-F, 20cm longitud</td>
            </tr>
            <tr>
                <td class="text-center">10</td>
                <td>Protoboard</td>
                <td class="text-center">1</td>
                <td>Placa de pruebas para montaje temporal</td>
                <td>400 puntos, half-size</td>
            </tr>
            <tr>
                <td class="text-center">11</td>
                <td>Caja protección</td>
                <td class="text-center">1</td>
                <td>Carcasa plástica para protección de componentes</td>
                <td>IP54, ABS, ventilación</td>
            </tr>
        </tbody>
    </table>

    <div class="subtitle">Notas Importantes</div>
    <ul class="notes-list info-text">
        <li>Alimentación: El sistema consume aproximadamente 50-70mA durante operación normal.</li>
        <li>Conexiones: Utilizar cables de buena calidad para evitar lecturas erróneas.</li>
        <li>Calibración: El sensor DHT22 puede requerir un período de estabilización de 2-3 minutos.</li>
        <li>Protección: Evitar exposición directa a lluvia o humedad extrema.</li>
        <li>Mantenimiento: Verificar conexiones periódicamente y limpiar sensores suavemente.</li>
    </ul>

    <div class="subtitle">Costo Estimado del Proyecto</div>
    <div class="info-text">
        El costo total aproximado de este proyecto varía entre $25-40 USD dependiendo del 
        proveedor y la calidad de los componentes. Se recomienda adquirir componentes de 
        proveedores confiables para garantizar la durabilidad y precisión del sistema.
    </div>
</body>
`.trim();


export default function CodeToPdf() {
    const [code, setCode] = useState<string>(defaultCode);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const { toast } = useToast();
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);

    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
      // Every time the code changes, we set the iframe as not loaded.
      // The `onLoad` event on the iframe will set it back to true.
      setIsIframeLoaded(false);
    }, [code]);

    const handleGeneratePdf = async () => {
        setIsGenerating(true);
        
        if (!iframeRef.current || !isIframeLoaded) {
             toast({
                title: "Error",
                description: "Cannot generate PDF. Output not available or still loading.",
                variant: "destructive",
            });
            setIsGenerating(false);
            return;
        }
        
        const iframeDoc = iframeRef.current.contentDocument;
        if (!iframeDoc || !iframeDoc.body) {
            toast({
                title: "Error",
                description: "Cannot access output content to generate PDF.",
                variant: "destructive",
            });
            setIsGenerating(false);
            return;
        }

        const elementToCapture = iframeDoc.body;

        try {
            const canvas = await html2canvas(elementToCapture, {
                useCORS: true,
                scale: 3, // Increased scale for better quality
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
            const imgRatio = canvas.width / canvas.height;
            
            let newImgWidth = pdfWidth;
            let newImgHeight = newImgWidth / imgRatio;

            if (newImgHeight > pdfHeight) {
                newImgHeight = pdfHeight;
                newImgWidth = newImgHeight * imgRatio;
            }

            const x = (pdfWidth - newImgWidth) / 2;
            const y = (pdfHeight - newImgHeight) / 2;

            pdf.addImage(imgData, 'PNG', x, y, newImgWidth, newImgHeight);
            pdf.save(`output.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast({
                title: "Failed to generate PDF",
                description: "An unexpected error occurred. Please check the console.",
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

    const outputBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';

    return (
        <div className="min-h-screen flex flex-col">
            <header className="text-center py-8">
                <h1 className="text-4xl lg:text-5xl font-bold font-headline tracking-tight">Code2PDF</h1>
                <p className="text-muted-foreground mt-2 text-lg">Convierte tus fragmentos de código en hermosos PDF para compartir.</p>
            </header>
            <main className="container mx-auto p-4 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">Tu Código</CardTitle>
                                <CardDescription>Pega tu código aquí. El HTML/JS se renderiza en la pestaña "Salida". Python no se ejecuta.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Pega tu código aquí..."
                                    className="h-96 font-code text-sm rounded-md transition-shadow duration-300 focus:shadow-outline"
                                    rows={20}
                                />
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">Configuración</CardTitle>
                                <CardDescription>Personaliza la apariencia de tu PDF.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="theme-switch" className="font-medium">Tema</Label>
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
                                    <Label className="font-medium">Diseño del PDF</Label>
                                    <RadioGroup
                                        value={orientation}
                                        onValueChange={(value: 'portrait' | 'landscape') => setOrientation(value)}
                                        className="flex gap-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="portrait" id="portrait" />
                                            <Label htmlFor="portrait">Vertical</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="landscape" id="landscape" />
                                            <Label htmlFor="landscape">Horizontal</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-3">
                        <Card className="shadow-lg h-full flex flex-col">
                           <CardHeader className="flex-row items-center justify-between border-b">
                                <div className="flex items-center gap-2">
                                    <Eye className="h-5 w-5"/>
                                    <CardTitle className="text-xl">Salida</CardTitle>
                                </div>
                                <Button onClick={handleGeneratePdf} disabled={isGenerating || !isIframeLoaded} size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                                    {isGenerating ? (
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    ) : (
                                        <Download className="mr-2 h-5 w-5" />
                                    )}
                                    Descargar PDF
                                </Button>
                           </CardHeader>
                           <CardContent className="flex-grow p-4 md:p-6">
                                <div className={`p-1 rounded-lg overflow-hidden transition-all duration-300 ${outputBg}`}>
                                        <iframe
                                        ref={iframeRef}
                                        srcDoc={code}
                                        title="output"
                                        sandbox="allow-scripts allow-same-origin"
                                        frameBorder="0"
                                        width="100%"
                                        height="500px"
                                        className="rounded-md"
                                        onLoad={() => setIsIframeLoaded(true)}
                                        />
                                </div>
                           </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

    