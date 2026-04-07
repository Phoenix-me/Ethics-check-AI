/**
 * EthicsCheck AI - Main Page
 * 
 * This is the main page of the application. It contains:
 * - A hero header with branding
 * - A text input area for users to paste their content
 * - A "Check Ethics" button to trigger analysis
 * - Results section with score gauge, category cards, warnings, and suggestions
 * - PDF report download button
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, AlertTriangle, Lightbulb, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeText, type AnalysisResult, getScoreColor } from "@/lib/ethicsAnalyzer";
import ScoreGauge from "@/components/ScoreGauge";
import CategoryCard from "@/components/CategoryCard";
import ReportDownload from "@/components/ReportDownload";

const Index = () => {
  // State for the text input
  const [text, setText] = useState("");
  // State for the analysis results (null = not analyzed yet)
  const [result, setResult] = useState<AnalysisResult | null>(null);
  // Loading state for the animation
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * Handles the "Check Ethics" button click.
   * Simulates a brief loading period, then runs the analysis.
   */
  const handleAnalyze = () => {
    if (text.trim().length < 20) return; // Need at least some text
    setIsAnalyzing(true);
    setResult(null);

    // Simulate processing time for a nice UX feel
    setTimeout(() => {
      const analysisResult = analyzeText(text);
      setResult(analysisResult);
      setIsAnalyzing(false);
    }, 1200);
  };

  /** Resets everything to start fresh */
  const handleReset = () => {
    setText("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ===== HERO HEADER ===== */}
      <header className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto px-4 py-16 md:py-24 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Shield className="w-10 h-10 text-accent" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground tracking-tight">
              EthicsCheck AI
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-primary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Analyze your writing for ethical integrity. Detect AI patterns, check citations,
            and ensure authentic personal input.
          </motion.p>
        </div>
        {/* Decorative grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">

        {/* --- Text Input Section --- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-10"
        >
          <label htmlFor="content-input" className="block text-sm font-semibold text-foreground mb-2">
            Paste your text below
          </label>
          <Textarea
            id="content-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your essay, article, or assignment here to check for ethical writing practices..."
            className="min-h-[200px] text-base resize-y bg-card border-border focus:ring-2 focus:ring-accent/50 font-sans"
            disabled={isAnalyzing}
          />
          {/* Character count */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {text.length} characters · {text.split(/\s+/).filter(w => w).length} words
            </span>
            <span className="text-xs text-muted-foreground">
              Minimum 20 characters required
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-5">
            <Button
              onClick={handleAnalyze}
              disabled={text.trim().length < 20 || isAnalyzing}
              className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 px-8"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Check Ethics
                </>
              )}
            </Button>

            {result && (
              <Button onClick={handleReset} variant="outline" size="lg" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            )}
          </div>
        </motion.section>

        {/* ===== RESULTS SECTION ===== */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              {/* --- Overall Score --- */}
              <section className="text-center mb-10 p-8 rounded-xl border border-border bg-card shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
                  Ethics Score
                </h2>
                <ScoreGauge score={result.overallScore} />
                <div className="mt-6">
                  <ReportDownload result={result} text={text} />
                </div>
              </section>

              {/* --- Category Breakdown --- */}
              <section className="mb-10">
                <h2 className="text-lg font-bold text-foreground mb-4">Detailed Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.breakdown.map((cat, i) => (
                    <CategoryCard key={cat.name} category={cat} index={i} />
                  ))}
                </div>
              </section>

              {/* --- Warnings --- */}
              {result.warnings.length > 0 && (
                <motion.section
                  className="mb-8 p-5 rounded-xl border border-score-red/20 bg-score-red/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-score-red" />
                    <h3 className="font-semibold text-foreground">Warnings</h3>
                  </div>
                  <ul className="space-y-2">
                    {result.warnings.map((w, i) => (
                      <li key={i} className="text-sm text-foreground/80">{w}</li>
                    ))}
                  </ul>
                </motion.section>
              )}

              {/* --- Suggestions --- */}
              <motion.section
                className="mb-8 p-5 rounded-xl border border-accent/20 bg-accent/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-foreground">Suggestions</h3>
                </div>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-foreground/80">• {s}</li>
                  ))}
                </ul>
              </motion.section>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== FOOTER ===== */}
        <footer className="text-center py-10 border-t border-border mt-10">
          <p className="text-xs text-muted-foreground">
            EthicsCheck AI — A portfolio project by a cybersecurity student.
            This tool runs entirely in your browser. No data is sent to any server.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
