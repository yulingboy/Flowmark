import { useState } from 'react';
import { Plus, Trash2, Check, Flame } from 'lucide-react';
import { useHabit } from './useHabit';
import { getStreak, getWeekRecords, getTodayString, HABIT_ICONS, HABIT_COLORS } from './types';

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];

export function HabitModal() {
  const { habits, addHabit, removeHabit, toggleCheck } = useHabit();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);

  const todayStr = getTodayString();
  const completedCount = habits.filter(h => h.records[todayStr]).length;

  const handleAdd = () => {
    if (newName.trim()) {
      addHabit(newName.trim(), selectedIcon, selectedColor);
      setNewName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-green-500 to-emerald-600 text-white">
      {/* 头部 */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <div>
              <h2 className="text-lg font-bold">习惯养成</h2>
              <p className="text-sm text-white/70">
                今日已完成 {completedCount}/{habits.length}
              </p>
            </div>
          </div>
          <div
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </div>
        </div>

        {/* 添加表单 */}
        {showAddForm && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg space-y-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="习惯名称"
              className="w-full px-3 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 outline-none focus:bg-white/20"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            
            {/* 图标选择 */}
            <div className="flex flex-wrap gap-2">
              {HABIT_ICONS.map(icon => (
                <div
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-8 h-8 flex items-center justify-center rounded cursor-pointer transition-all ${
                    selectedIcon === icon ? 'bg-white/30 scale-110' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {icon}
                </div>
              ))}
            </div>
            
            {/* 颜色选择 */}
            <div className="flex gap-2">
              {HABIT_COLORS.map(color => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
                    selectedColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            <div className="flex justify-end gap-2">
              <div
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-sm rounded-lg hover:bg-white/10 cursor-pointer"
              >
                取消
              </div>
              <div
                onClick={handleAdd}
                className="px-3 py-1.5 text-sm bg-white/20 rounded-lg hover:bg-white/30 cursor-pointer"
              >
                添加
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 习惯列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/60">
            <span className="text-4xl mb-2">🎯</span>
            <p>还没有习惯</p>
            <p className="text-sm">点击右上角添加</p>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map(habit => {
              const isChecked = !!habit.records[todayStr];
              const streak = getStreak(habit.records);
              const weekRecords = getWeekRecords(habit.records);
              
              return (
                <div
                  key={habit.id}
                  className={`p-3 rounded-lg transition-all ${
                    isChecked ? 'bg-white/20' : 'bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* 打卡按钮 */}
                    <div
                      onClick={() => toggleCheck(habit.id)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                        isChecked ? '' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: habit.color }}
                    >
                      {isChecked ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-lg">{habit.icon}</span>
                      )}
                    </div>
                    
                    {/* 习惯信息 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${isChecked ? 'line-through opacity-60' : ''}`}>
                          {habit.name}
                        </span>
                        {streak > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-amber-300">
                            <Flame className="w-3 h-3" />
                            {streak}天
                          </span>
                        )}
                      </div>
                      
                      {/* 本周打卡情况 */}
                      <div className="flex gap-1 mt-1.5">
                        {weekRecords.map((checked, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div
                              className={`w-4 h-4 rounded-sm ${
                                checked ? '' : 'opacity-30'
                              }`}
                              style={{ backgroundColor: checked ? habit.color : '#fff' }}
                            />
                            <span className="text-[10px] text-white/40 mt-0.5">
                              {WEEKDAYS[i]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* 删除按钮 */}
                    <div
                      onClick={() => removeHabit(habit.id)}
                      className="p-1.5 rounded-full hover:bg-white/10 cursor-pointer opacity-50 hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
