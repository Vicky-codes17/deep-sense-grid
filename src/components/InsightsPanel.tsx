import { Insight } from "@/types/aquaculture";
import { Lightbulb } from "lucide-react";

interface InsightsPanelProps {
  insights: Insight[];
}

const InsightsPanel = ({ insights }: InsightsPanelProps) => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold font-poppins">System Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.length === 0 ? (
          <div className="text-muted-foreground text-center py-8 shimmer">
            Analyzing tank conditions...
          </div>
        ) : (
          insights.map((insight, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                insight.type === "danger"
                  ? "bg-destructive/10 border-destructive/30 alert-pulse"
                  : insight.type === "warning"
                  ? "bg-warning/10 border-warning/30"
                  : "bg-success/10 border-success/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    insight.type === "danger"
                      ? "bg-destructive"
                      : insight.type === "warning"
                      ? "bg-warning"
                      : "bg-success"
                  }`}
                />
                <p className="flex-1 text-sm font-inter">{insight.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {insights.some(i => i.type === "danger") && (
        <div className="mt-4 p-4 bg-destructive/20 border border-destructive/40 rounded-lg">
          <div className="font-semibold text-destructive mb-1">⚠️ Immediate Action Required</div>
          <div className="text-sm text-destructive-foreground">
            Critical parameters detected. Review recommendations above.
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsPanel;
