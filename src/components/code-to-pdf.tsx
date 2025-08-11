
"use client";

import { useState, useRef, useEffect } from 'react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Download, Loader2, Moon, Sun, RefreshCw, Link, Copy, ServerCrash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { createGist, getGist } from '@/ai/flows/gist-flow';

const defaultCode = `
<style>
    body {
        font-family: 'Inter', Helvetica, Arial, sans-serif;
        font-size: 10px;
        line-height: 1.4;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: white;
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

async function fetchAsBase64(url: string) {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
    }
    const ab = await res.arrayBuffer();
    let binary = '';
    const bytes = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

const ensureFontsAndStyles = async (iframe: HTMLIFrameElement) => {
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) throw new Error('No se pudo acceder al documento del iframe.');

    const basePath = (window as any).next?.router?.basePath || '';
    
    // Asumiendo que las fuentes están en /public/fonts/
    // Debes agregar los archivos Inter-Regular.ttf y SourceCodePro-Regular.ttf a esa carpeta
    const interB64 = await fetchAsBase64(`${basePath}/fonts/Inter-Regular.ttf`);
    const sourceCodeProB64 = await fetchAsBase64(`${basePath}/fonts/SourceCodePro-Regular.ttf`);

    const style = doc.createElement('style');
    style.textContent = `
    @font-face {
      font-family: 'Inter';
      src: url('data:font/ttf;base64,${interB64}') format('truetype');
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: 'Source Code Pro';
      src: url('data:font/ttf;base64,${sourceCodeProB64}') format('truetype');
      font-weight: 400;
      font-style: normal;
    }
  `;
    doc.head.appendChild(style);

    // Esperar a que las fuentes estén cargadas y listas en el iframe
    await (iframe.contentWindow as any).document.fonts.ready;
    
    return { interB64, sourceCodeProB64 };
};


export default function CodeToPdf() {
    const [code, setCode] = useState<string>(defaultCode);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [pageSize, setPageSize] = useState<string>('a4');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [shareableLink, setShareableLink] = useState('');
    const { toast } = useToast();
    const [outputCode, setOutputCode] = useState(code);
    
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const loadGistFromUrl = async () => {
            const params = new URLSearchParams(window.location.search);
            const gistId = params.get('gist');
            if (gistId) {
                try {
                    const gistContent = await getGist(gistId);
                    setCode(gistContent);
                    setOutputCode(gistContent);
                    toast({
                        title: "Código Cargado",
                        description: "El código se ha cargado desde el Gist compartido.",
                    });
                } catch (e) {
                    console.error("Error loading from Gist", e);
                    toast({
                        title: "Error de Carga",
                        description: "No se pudo cargar el código desde el Gist. Puede que sea inválido o haya sido eliminado.",
                        variant: "destructive",
                    });
                }
            }
        };
        loadGistFromUrl();
    }, [toast]);
    
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const themeParam = params.get('theme') as 'light' | 'dark' | null;
        const orientationParam = params.get('orientation') as 'portrait' | 'landscape' | null;
        const pageSizeParam = params.get('size');
        
        if (themeParam) setTheme(themeParam);
        if (orientationParam) setOrientation(orientationParam);
        if (pageSizeParam) setPageSize(pageSizeParam);
    }, []);

    useEffect(() => {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);


    const handleUpdateCode = () => {
        setOutputCode(code);
    };

    const handleGeneratePdf = async () => {
        setIsGenerating(true);
        const iframe = iframeRef.current;

        if (!iframe?.contentWindow?.document?.body) {
            toast({
                title: "Error de Renderizado",
                description: "No se puede acceder al contenido del preview para generar el PDF.",
                variant: "destructive",
            });
            setIsGenerating(false);
            return;
        }
        
        try {
            const { interB64, sourceCodeProB64 } = await ensureFontsAndStyles(iframe);
            await import('jspdf/dist/polyfills.es.js');
            
            const pdf = new jsPDF({
                orientation: orientation,
                unit: 'pt',
                format: pageSize,
                compress: true,
            });

            pdf.addFileToVFS('Inter-Regular.ttf', interB64);
            pdf.addFont('Inter-Regular.ttf', 'Inter', 'normal');
            pdf.addFileToVFS('SourceCodePro-Regular.ttf', sourceCodeProB64);
            pdf.addFont('SourceCodePro-Regular.ttf', 'Source Code Pro', 'normal');
            pdf.setFont('Inter');

            await pdf.html(iframe.contentWindow.document.body, {
                callback: function (doc) {
                    doc.save('code-output.pdf');
                },
                x: 15,
                y: 15,
                width: pdf.internal.pageSize.getWidth() - 30,
                windowWidth: iframe.contentWindow.document.documentElement.scrollWidth,
                autoPaging: 'text',
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    allowTaint: false,
                }
            });
            
            toast({
                title: "PDF Generado",
                description: "Tu PDF vectorial ha sido descargado exitosamente.",
            });
                
        } catch (error) {
            console.error("Error al generar PDF:", error);
            toast({
                title: "Error al Generar PDF",
                description: `Ocurrió un error: ${error instanceof Error ? error.message : 'Error desconocido'}`,
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleThemeChange = (checked: boolean) => {
        const newTheme = checked ? 'dark' : 'light';
        setTheme(newTheme);
    };

    const handleGenerateLink = async () => {
        setIsSharing(true);
        try {
            const gistId = await createGist(code);
            if (!gistId) {
                throw new Error("No se recibió un ID de Gist del servidor.");
            }
            const params = new URLSearchParams();
            params.set('gist', gistId);
            params.set('theme', theme);
            params.set('orientation', orientation);
            params.set('size', pageSize);
            const link = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
            setShareableLink(link);
            toast({
                title: "Enlace generado",
                description: "El enlace para compartir se ha creado y puedes copiarlo.",
            });
        } catch (error) {
            console.error("Error creating shareable link:", error);
            let description = "No se pudo crear el enlace para compartir.";
            if (error instanceof Error && error.message.includes('401')) {
                description = "Error de autenticación. Revisa tu Token de GitHub en el archivo .env.local."
            } else if (error instanceof Error && error.message.includes('Failed to fetch')) {
                description = "No se pudo conectar con el servidor de GitHub. Revisa tu conexión."
            }
            toast({
                title: "Error al generar enlace",
                description: description,
                variant: "destructive",
                icon: <ServerCrash />,
            });
        } finally {
            setIsSharing(false);
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(shareableLink).then(() => {
            toast({
                title: "Copiado",
                description: "Enlace copiado al portapapeles.",
            });
        }, (err) => {
            console.error('Could not copy text: ', err);
            toast({
                title: "Error",
                description: "No se pudo copiar el enlace.",
                variant: "destructive",
            });
        });
    };

    const outputBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';
    const a4AspectRatio = orientation === 'portrait' ? '1 / 1.414' : '1.414 / 1';

    return (
        <div className="min-h-screen flex flex-col">
            <header className="text-center py-8">
                <h1 className="text-4xl lg:text-5xl font-bold font-headline tracking-tight">Code2PDF</h1>
                <p className="text-muted-foreground mt-2 text-lg">Convierte tus fragmentos de código en hermosos PDF de alta calidad.</p>
            </header>
            <main className="container mx-auto p-4 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">Tu Código</CardTitle>
                                <CardDescription>Pega tu código aquí. El HTML/JS se renderiza en el panel de la derecha.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <Textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Pega tu código aquí..."
                                    className="h-96 font-code text-sm rounded-md transition-shadow duration-300 focus:shadow-outline"
                                    rows={20}
                                />
                                <Button onClick={handleUpdateCode}>
                                    <RefreshCw className="mr-2 h-5 w-5" />
                                    Actualizar Vista Previa
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-xl">Configuración y Compartir</CardTitle>
                                <CardDescription>Personaliza la apariencia y comparte tu PDF.</CardDescription>
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
                               
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <Label className="font-medium">Orientación</Label>
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
                                    <div className="space-y-3">
                                        <Label htmlFor="page-size" className="font-medium">Tamaño de Hoja</Label>
                                        <Select value={pageSize} onValueChange={setPageSize}>
                                            <SelectTrigger id="page-size">
                                                <SelectValue placeholder="Selecciona un tamaño" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="a4">A4 (210 x 297 mm)</SelectItem>
                                                <SelectItem value="letter">Carta (8.5 x 11 in)</SelectItem>
                                                <SelectItem value="legal">Legal (8.5 x 14 in)</SelectItem>
                                                <SelectItem value="a3">A3 (297 x 420 mm)</SelectItem>
                                                <SelectItem value="a5">A5 (148 x 210 mm)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <Label className="font-medium">Compartir</Label>
                                    <Button onClick={handleGenerateLink} className="w-full" disabled={isSharing}>
                                        {isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Link className="mr-2 h-4 w-4" />}
                                        {isSharing ? 'Generando Enlace...' : 'Generar Enlace para Compartir'}
                                    </Button>
                                    {shareableLink && (
                                        <div className="flex gap-2">
                                            <Input value={shareableLink} readOnly className="bg-muted" />
                                            <Button onClick={handleCopyToClipboard} size="icon" variant="outline">
                                                <Copy className="h-4 w-4" />
                                                <span className="sr-only">Copiar enlace</span>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card className="shadow-lg h-full flex flex-col">
                           <CardHeader className="flex-row items-center justify-between border-b">
                                <CardTitle className="text-xl">Vista Previa</CardTitle>
                                <div className="flex flex-col items-end gap-2">
                                    <Button onClick={handleGeneratePdf} disabled={isGenerating} size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                                        {isGenerating ? (
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                            <Download className="mr-2 h-5 w-5" />
                                        )}
                                        {isGenerating ? 'Generando PDF...' : 'Descargar PDF'}
                                    </Button>
                                </div>
                           </CardHeader>
                           <CardContent className="flex-grow p-4 md:p-6">
                                <div className={`p-1 rounded-lg overflow-hidden transition-all duration-300 ${outputBg}`}>
                                    <iframe
                                        ref={iframeRef}
                                        srcDoc={outputCode}
                                        title="output"
                                        sandbox="allow-scripts allow-same-origin"
                                        frameBorder="0"
                                        className="rounded-md w-full"
                                        style={{
                                            aspectRatio: a4AspectRatio,
                                            height: 'auto',
                                            maxHeight: '70vh'
                                        }}
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

    