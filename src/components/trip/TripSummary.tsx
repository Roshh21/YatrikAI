import { Receipt } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TripSummaryProps {
  fullResponse: string;
}

function extractSummary(text: string): string {
  const summaryMatch = text.match(/##\s*(?:Trip\s*)?Summary[\s\S]*?(?=##|$)/i);
  if (summaryMatch) {
    return summaryMatch[0];
  } 

  const totalMatch = text.match(/(?:Total|Estimated)\s*(?:Cost|Budget)[\s\S]{0,500}/i);
  if (totalMatch) {
    return totalMatch[0];
  }

  const words = text.split(/\s+/);
  const lastWords = words.slice(-200).join(' ');
  
  const costPattern = /₹[\d,]+/g;
  const costs = lastWords.match(costPattern);
  
  if (costs && costs.length > 0) {
    const paragraphs = lastWords.split('\n\n');
    let bestParagraph = paragraphs[paragraphs.length - 1];
    let maxCosts = 0;
    
    for (const para of paragraphs) {
      const paraCosts = (para.match(costPattern) || []).length;
      if (paraCosts > maxCosts) {
        maxCosts = paraCosts;
        bestParagraph = para;
      }
    }
    
    return `## Summary\n\n${bestParagraph}`;
  }

  return `## Summary\n\n${lastWords}`;
}

export default function TripSummary({ fullResponse }: TripSummaryProps) {
  const summary = extractSummary(fullResponse);
  
  const lines = summary.split('\n').filter(line => line.trim());
  const costLines = lines.filter(line => line.includes('₹'));
  
  return (
    <Card className="shadow-soft-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
            <Receipt className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>Cost Summary</CardTitle>
            <CardDescription>Quick overview of estimated costs</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {costLines.length > 0 ? (
            <div className="space-y-3">
              {costLines.slice(0, 5).map((line, idx) => {
                const cleanLine = line.replace(/^[*-]\s*/, '').replace(/\*\*/g, '').trim();
                const parts = cleanLine.split(':');
                if (parts.length === 2) {
                  return (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="font-medium">{parts[0].trim()}</span>
                      <span className="text-lg font-bold text-primary">{parts[1].trim()}</span>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm">{cleanLine}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <p>Summary information will appear here once the estimate is generated.</p>
            </div>
          )}
          
          <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Note:</strong> All costs are estimates in Indian Rupees (₹) and may vary based on season, availability, and booking time.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
