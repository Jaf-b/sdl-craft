import { Handle, NodeProps, Position } from "@xyflow/react";
import { Server, HardDrive, Cpu, Package, Cloud, Database, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UmlDeploymentNode } from "../types";

export function UmlDeploymentNodeComponent({ id, data, selected }: NodeProps<UmlDeploymentNode>) {
  const { label, kind, stereotype } = data;

  const iconMap = {
    node: Server,
    device: Cpu,
    artifact: Package,
    executionEnvironment: Cloud,
  };

  const colorMap = {
    node: "border-cyan-500/60 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    device: "border-blue-500/60 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    artifact: "border-emerald-500/60 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    executionEnvironment: "border-purple-500/60 bg-purple-500/10 text-purple-600 dark:text-purple-400",
  };

  const IconComponent = iconMap[kind] || Server;

  return (
    <div className={`w-[220px] rounded-lg border-2 bg-card shadow-lg transition-all ${colorMap[kind] || "border-cyan-500/60"} ${selected ? "ring-2 ring-cyan-400" : ""}`}>
      {/* Handles – 4 côtés */}
      <Handle id="top" type="target" position={Position.Top} className="!bg-cyan-500 !w-2.5 !h-2.5" />
      <Handle id="top-src" type="source" position={Position.Top} className="!bg-cyan-500 !w-2.5 !h-2.5" style={{ left: "65%" }} />
      <Handle id="bottom" type="target" position={Position.Bottom} className="!bg-cyan-500 !w-2.5 !h-2.5" />
      <Handle id="bottom-src" type="source" position={Position.Bottom} className="!bg-cyan-500 !w-2.5 !h-2.5" style={{ left: "65%" }} />
      <Handle id="left" type="target" position={Position.Left} className="!bg-cyan-500 !w-2.5 !h-2.5" />
      <Handle id="left-src" type="source" position={Position.Left} className="!bg-cyan-500 !w-2.5 !h-2.5" style={{ top: "65%" }} />
      <Handle id="right" type="target" position={Position.Right} className="!bg-cyan-500 !w-2.5 !h-2.5" />
      <Handle id="right-src" type="source" position={Position.Right} className="!bg-cyan-500 !w-2.5 !h-2.5" style={{ top: "65%" }} />

      {/* Header avec perspective 3D / Stéréotype */}
      <div className="flex items-center justify-between p-2.5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-background/80 border border-border shrink-0">
            <IconComponent className="h-4 w-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-mono text-muted-foreground uppercase">
              {stereotype || `«${kind}»`}
            </span>
            <span className="text-xs font-bold font-mono text-foreground truncate max-w-[120px]">
              {label || "Nœud"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-0.5 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              data.onEdit?.(id);
            }}
          >
            <Pencil className="h-2.5 w-2.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5 text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete?.(id);
            }}
          >
            <Trash2 className="h-2.5 w-2.5" />
          </Button>
        </div>
      </div>

      <div className="p-2 text-[10px] font-mono text-muted-foreground bg-background/40 rounded-b-lg flex items-center justify-between">
        <span>Type : {kind}</span>
        <Badge variant="outline" className="text-[9px] px-1 py-0 bg-background font-normal">
          UML 2.5
        </Badge>
      </div>
    </div>
  );
}
