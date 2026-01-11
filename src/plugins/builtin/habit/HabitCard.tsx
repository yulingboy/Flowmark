import { Check } from 'lucide-react';
import type { PluginSize } from '../../types';
import { useHabit } from './useHabit';
import { getStreak, getTodayString } from './types';

/** 单个习惯项 */
function HabitItem({ 
  habit, 
  compact = false,
  onToggle 
}: { 
  habit: { id: string; name: string; icon: string; color: string; records: Record<string, boolean> };
  compact?: boolean;
  onToggle: () => void;
}) {
  const isChecked = !!habit.records[getTodayString()];
  const streak = getStreak(habit.records);

  if (compact) {
    return (
      <div
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={`flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-all ${
          isChecked ? 'opacity-100' : 'opacity-50 hover:opacity-75'
        }`}
        style={{ backgroundColor: isChecked ? habit.color : `${habit.color}40` }}
        title={`${habit.name}${isChecked ? ' ✓' : ''}`}
      >
        {isChecked ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <span className="text-sm">{habit.icon}</span>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
        isChecked ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-lg ${
          isChecked ? '' : 'opacity-60'
        }`}
        style={{ backgroundColor: habit.color }}
      >
        {isChecked ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <span className="text-sm">{habit.icon}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-sm ${isChecked ? 'line-through opacity-60' : ''}`}>
          {habit.name}
        </span>
      </div>
      {streak > 0 && (
        <span className="text-xs text-white/60">🔥{streak}</span>
      )}
    </div>
  );
}

export function HabitCard({ size }: { size: PluginSize }) {
  const { habits, toggleCheck } = useHabit();

  // 统计今日完成情况
  const todayStr = getTodayString();
  const completedCount = habits.filter(h => h.records[todayStr]).length;
  const totalCount = habits.length;

  // 1x1 尺寸：显示完成进度
  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-500/80 to-emerald-600/80 rounded-xl">
        <span className="text-2xl">✅</span>
        <span className="text-xs text-white/80 mt-1">
          {completedCount}/{totalCount}
        </span>
      </div>
    );
  }

  // 2x2 尺寸：显示习惯列表
  if (size === '2x2') {
    return (
      <div className="w-full h-full flex flex-col bg-gradient-to-br from-green-500/80 to-emerald-600/80 rounded-xl p-3 text-white">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium">✅ 今日习惯</span>
          <span className="text-xs text-white/60">{completedCount}/{totalCount}</span>
        </div>
        
        {/* 习惯列表 */}
        {habits.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-white/60">
            点击添加习惯
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <div className="flex flex-wrap gap-2">
              {habits.slice(0, 8).map(habit => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  compact
                  onToggle={() => toggleCheck(habit.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2x4 尺寸：完整显示
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-green-500/80 to-emerald-600/80 rounded-xl p-4 text-white">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">✅</span>
          <span className="text-base font-medium">习惯养成</span>
        </div>
        <span className="text-sm text-white/70">{completedCount}/{totalCount} 已完成</span>
      </div>
      
      {/* 习惯列表 */}
      {habits.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-white/60">
          点击卡片添加习惯
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2">
          {habits.map(habit => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onToggle={() => toggleCheck(habit.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
