import { useState } from 'react';
import { Plus, Trash2, Check, Flame, Minus } from 'lucide-react';
import { useHabit } from './useHabit';
import type { HabitType } from './types';
import { getStreak, getWeekRecords, HABIT_COLORS, isHabitCompleted, getHabitProgress } from './types';

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];

export function HabitModal() {
  const { habits, addHabit, removeHabit, toggleCheck, incrementCount, decrementCount } = useHabit();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [habitType, setHabitType] = useState<HabitType>('check');
  const [targetCount, setTargetCount] = useState(1);

  const completedCount = habits.filter(h => isHabitCompleted(h)).length;

  const handleAdd = () => {
    if (newName.trim()) {
      addHabit(newName.trim(), selectedColor, habitType, habitType === 'count' ? targetCount : undefined);
      setNewName('');
      setHabitType('check');
      setTargetCount(1);
      setShowAddForm(false);
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setNewName('');
    setHabitType('check');
    setTargetCount(1);
  };

  return (
    <div className="h-full flex flex-col bg-neutral-900 text-neutral-100">
      {/* 头部 */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">习惯养成</h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              今日 {completedCount}/{habits.length}
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* 添加表单 */}
        {showAddForm && (
          <div className="mt-4 p-3 bg-neutral-800 rounded-lg space-y-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="习惯名称"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500"
            />

            {/* 习惯类型选择 */}
            <div className="flex gap-2">
              <button
                onClick={() => setHabitType('check')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                  habitType === 'check' 
                    ? 'bg-neutral-600 text-white' 
                    : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                }`}
              >
                打卡型
              </button>
              <button
                onClick={() => setHabitType('count')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
                  habitType === 'count' 
                    ? 'bg-neutral-600 text-white' 
                    : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                }`}
              >
                计数型
              </button>
            </div>

            {/* 计数型目标设置 */}
            {habitType === 'count' && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-400">每日目标</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded bg-neutral-700 hover:bg-neutral-600 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-neutral-300" />
                  </button>
                  <span className="w-8 text-center tabular-nums">{targetCount}</span>
                  <button
                    onClick={() => setTargetCount(targetCount + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded bg-neutral-700 hover:bg-neutral-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-neutral-300" />
                  </button>
                </div>
                <span className="text-sm text-neutral-500">次</span>
              </div>
            )}
            
            {/* 颜色选择 */}
            <div className="flex gap-2">
              {HABIT_COLORS.map(color => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                    selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-800 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={resetForm}
                className="px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAdd}
                className="px-3 py-1.5 text-sm bg-neutral-700 hover:bg-neutral-600 rounded-lg transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 习惯列表 - 添加时隐藏 */}
      {!showAddForm && (
        <div className="flex-1 overflow-y-auto p-4">
          {habits.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500">
              <p>还没有习惯</p>
              <p className="text-sm text-neutral-600">点击右上角添加</p>
            </div>
          ) : (
            <div className="space-y-2">
              {habits.map(habit => {
                const isCompleted = isHabitCompleted(habit);
                const { current, target } = getHabitProgress(habit);
                const streak = getStreak(habit.records, target);
                const weekRecords = getWeekRecords(habit.records, target);
                const isCountType = habit.type === 'count';
                
                return (
                  <div
                    key={habit.id}
                    className={`p-3 rounded-lg transition-colors ${
                      isCompleted ? 'bg-neutral-800' : 'bg-neutral-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* 打卡按钮 */}
                      <div
                        onClick={() => isCountType ? incrementCount(habit.id) : toggleCheck(habit.id)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-opacity ${
                          isCompleted ? '' : 'opacity-60 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: habit.color }}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-xs text-white font-medium">
                            {habit.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      
                      {/* 习惯信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium truncate ${isCompleted ? 'line-through text-neutral-500' : ''}`}>
                            {habit.name}
                          </span>
                          {streak > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-orange-400 shrink-0">
                              <Flame className="w-3 h-3" />
                              {streak}天
                            </span>
                          )}
                        </div>
                        
                        {/* 计数型显示进度 */}
                        {isCountType && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${Math.min(100, (current / target) * 100)}%`,
                                  backgroundColor: habit.color 
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => decrementCount(habit.id)}
                                className="w-5 h-5 flex items-center justify-center rounded bg-neutral-700 hover:bg-neutral-600 transition-colors"
                                disabled={current === 0}
                              >
                                <Minus className="w-3 h-3 text-neutral-400" />
                              </button>
                              <span className="text-xs text-neutral-400 w-10 text-center tabular-nums">
                                {current}/{target}
                              </span>
                              <button
                                onClick={() => incrementCount(habit.id)}
                                className="w-5 h-5 flex items-center justify-center rounded bg-neutral-700 hover:bg-neutral-600 transition-colors"
                              >
                                <Plus className="w-3 h-3 text-neutral-400" />
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* 打卡型显示本周情况 */}
                        {!isCountType && (
                          <div className="flex gap-1 mt-2">
                            {weekRecords.map((checked, i) => (
                              <div key={i} className="flex flex-col items-center">
                                <div
                                  className={`w-4 h-4 rounded-sm transition-opacity ${
                                    checked ? '' : 'opacity-20'
                                  }`}
                                  style={{ backgroundColor: checked ? habit.color : '#fff' }}
                                />
                                <span className="text-[10px] text-neutral-600 mt-0.5">
                                  {WEEKDAYS[i]}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* 删除按钮 */}
                      <button
                        onClick={() => removeHabit(habit.id)}
                        className="p-2 rounded-lg text-neutral-600 hover:text-neutral-400 hover:bg-neutral-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
