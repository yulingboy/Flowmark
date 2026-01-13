import { Check, Target, Plus, Minus } from 'lucide-react';
import type { PluginSize } from '@/types';
import { useHabit } from './useHabit';
import type { Habit } from './types';
import { getStreak, isHabitCompleted, getHabitProgress } from './types';

interface HabitItemProps {
  habit: Habit;
  onToggle: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

/** 紧凑习惯项 - 用于 2x2 尺寸 */
function CompactHabitItem({ habit, onToggle, onIncrement }: Omit<HabitItemProps, 'onDecrement'>) {
  const isCompleted = isHabitCompleted(habit);
  const { current, target } = getHabitProgress(habit);
  const isCountType = habit.type === 'count';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCountType) {
      onIncrement();
    } else {
      onToggle();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-all ${
        isCompleted ? 'ring-2 ring-white/30' : 'opacity-60 hover:opacity-100'
      }`}
      style={{ backgroundColor: isCompleted ? habit.color : `${habit.color}50` }}
      title={`${habit.name} ${isCountType ? `${current}/${target}` : (isCompleted ? '✓' : '')}`}
    >
      {isCompleted ? (
        <Check className="w-4 h-4 text-white" />
      ) : isCountType ? (
        <span className="text-[10px] text-white font-medium">{current}/{target}</span>
      ) : (
        <span className="text-xs text-white font-medium">{habit.name.charAt(0)}</span>
      )}
    </div>
  );
}

/** 完整习惯项 - 用于 2x4 尺寸 */
function FullHabitItem({ habit, onToggle, onIncrement, onDecrement }: HabitItemProps) {
  const isCompleted = isHabitCompleted(habit);
  const { current, target } = getHabitProgress(habit);
  const isCountType = habit.type === 'count';
  const streak = getStreak(habit.records, target);

  const handleMainClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCountType) {
      onIncrement();
    } else {
      onToggle();
    }
  };

  return (
    <div
      className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
        isCompleted ? 'bg-white/15' : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      <div
        onClick={handleMainClick}
        className={`flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-opacity ${
          isCompleted ? '' : 'opacity-70 hover:opacity-100'
        }`}
        style={{ backgroundColor: habit.color }}
      >
        {isCompleted ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <span className="text-xs text-white font-medium">{habit.name.charAt(0)}</span>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <span className={`text-sm truncate ${isCompleted ? 'line-through text-white/50' : 'text-white/90'}`}>
          {habit.name}
        </span>
      </div>

      {/* 计数型显示进度和加减按钮 */}
      {isCountType ? (
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onDecrement(); }}
            className="w-5 h-5 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-colors"
            disabled={current === 0}
          >
            <Minus className="w-3 h-3 text-white/70" />
          </button>
          <span className="text-xs text-white/70 w-8 text-center tabular-nums">{current}/{target}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onIncrement(); }}
            className="w-5 h-5 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Plus className="w-3 h-3 text-white/70" />
          </button>
        </div>
      ) : streak > 0 ? (
        <span className="text-xs text-orange-300/80">🔥{streak}</span>
      ) : null}
    </div>
  );
}

export function HabitCard({ size }: { size: PluginSize }) {
  const { habits, toggleCheck, incrementCount, decrementCount } = useHabit();

  const completedCount = habits.filter(h => isHabitCompleted(h)).length;
  const totalCount = habits.length;

  // 1x1 尺寸
  if (size === '1x1') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl">
        <Target className="w-6 h-6 text-white/70" />
        <span className="text-xs text-white/60 mt-1 tabular-nums">
          {completedCount}/{totalCount}
        </span>
      </div>
    );
  }

  // 2x2 尺寸
  if (size === '2x2') {
    return (
      <div className="w-full h-full flex flex-col bg-black/20 backdrop-blur-sm rounded-xl p-3 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/70">今日习惯</span>
          <span className="text-xs text-white/50 tabular-nums">{completedCount}/{totalCount}</span>
        </div>
        
        {habits.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-white/40">
            点击添加习惯
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <div className="flex flex-wrap gap-1.5">
              {habits.slice(0, 8).map(habit => (
                <CompactHabitItem
                  key={habit.id}
                  habit={habit}
                  onToggle={() => toggleCheck(habit.id)}
                  onIncrement={() => incrementCount(habit.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2x4 尺寸
  return (
    <div className="w-full h-full flex flex-col bg-black/20 backdrop-blur-sm rounded-xl p-4 text-white">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-white/90">习惯养成</span>
        <span className="text-xs text-white/50 tabular-nums">{completedCount}/{totalCount}</span>
      </div>
      
      {habits.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-white/40">
          点击添加习惯
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-1.5 -mr-1 pr-1">
          {habits.map(habit => (
            <FullHabitItem
              key={habit.id}
              habit={habit}
              onToggle={() => toggleCheck(habit.id)}
              onIncrement={() => incrementCount(habit.id)}
              onDecrement={() => decrementCount(habit.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
