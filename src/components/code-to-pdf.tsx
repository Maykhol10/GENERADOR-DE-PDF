
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
def greet(name):
  """
  This function greets the person passed in as a parameter.
  """
  print(f"Hello, {name}! Welcome to Code2PDF.")

if __name__ == "__main__":
  greet("Developer")
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
                                <CardDescription>Paste your code here (e.g., Python, JavaScript, HTML).</CardDescription>
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

    