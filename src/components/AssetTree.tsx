import { cn } from '../lib/utils';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface Asset {
  id: number;
  name: string;
  parentId: number | null;
  remarks: string;
}

interface AssetTreeProps {
  assets: Asset[];
  selectedAssetIds: number[];
  expandedAssetIds: number[];
  onToggleSelection: (id: number) => void;
  onToggleExpansion: (id: number) => void;
  showCount?: boolean;
  labCounts?: Record<number, number>;
}

export default function AssetTree({ 
  assets, 
  selectedAssetIds, 
  expandedAssetIds, 
  onToggleSelection, 
  onToggleExpansion,
  showCount = false,
  labCounts = {}
}: AssetTreeProps) {

  const renderTree = (parentId: number | null = null, level = 0) => {
    const children = assets.filter(a => a.parentId === parentId);
    if (children.length === 0) return null;

    return (
      <div className={cn("space-y-1", level > 0 && "ml-4 border-l border-slate-100 pl-2")}>
        {children.map(asset => {
          const hasChildren = assets.some(a => a.parentId === asset.id);
          const isExpanded = expandedAssetIds.includes(asset.id);
          const isSelected = selectedAssetIds.includes(asset.id);
          const count = labCounts[asset.id] || 0;

          return (
            <div key={asset.id}>
              <div 
                className={cn(
                  "flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-colors group",
                  isSelected ? "bg-purple-50 text-purple-700" : "hover:bg-slate-50 text-slate-600"
                )}
                onClick={() => onToggleSelection(asset.id)}
              >
                {hasChildren ? (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpansion(asset.id);
                    }}
                    className="p-0.5 hover:bg-slate-200 rounded"
                  >
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                ) : (
                  <div className="w-4.5" />
                )}
                <input 
                  type="checkbox" 
                  checked={isSelected} 
                  onChange={() => {}} 
                  className="w-3.5 h-3.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="text-sm font-medium">{asset.name}</span>
                {showCount && <span className="text-xs text-slate-400 ml-auto">({count})</span>}
              </div>
              {hasChildren && isExpanded && renderTree(asset.id, level + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">{renderTree()}</div>;
}
