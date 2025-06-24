import { Zap } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center bg-primary text-primary-foreground h-8 w-8 rounded-lg shadow-md">
        <Zap className="h-5 w-5" />
      </div>
      <span className="font-bold text-xl text-primary">BizTrack Lite</span>
    </div>
  );
}
