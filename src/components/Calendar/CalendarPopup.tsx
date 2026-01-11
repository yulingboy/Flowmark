import { useState, useMemo } from 'react';
import { SolarDay, LunarDay } from 'tyme4ts';
import { Calendar } from './Calendar';
import { MacModal } from '../common/MacModal';

interface CalendarPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 日历弹窗组件
 * 显示完整的日历和选中日期的详细信息
 */
export function CalendarPopup({ isOpen, onClose }: CalendarPopupProps) {
  const [selectedDate, setSelectedDate] = useState<{ solar: SolarDay; lunar: LunarDay } | null>(null);

  const handleDateSelect = (date: Date, lunar: LunarDay) => {
    const solar = SolarDay.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
    setSelectedDate({ solar, lunar });
  };

  /** 获取选中日期的详细信息 */
  const dateDetails = useMemo(() => {
    if (!selectedDate) return null;
    
    const { solar, lunar } = selectedDate;
    const lunarMonth = lunar.getLunarMonth();
    const lunarYear = lunarMonth.getLunarYear();
    
    // 干支信息
    const yearSixtyCycle = lunar.getYearSixtyCycle();
    const monthSixtyCycle = lunar.getMonthSixtyCycle();
    const daySixtyCycle = lunar.getSixtyCycle();
    
    // 星座
    const constellation = solar.getConstellation();
    
    // 节气
    const termDay = solar.getTermDay();
    const term = termDay.getSolarTerm();
    
    // 节日
    const lunarFestival = lunar.getFestival();
    const solarFestival = solar.getFestival();
    
    // 法定假日
    const legalHoliday = solar.getLegalHoliday();
    
    // 宜忌
    const recommends = lunar.getRecommends().slice(0, 6);
    const avoids = lunar.getAvoids().slice(0, 6);
    
    // 九星
    const nineStar = lunar.getNineStar();
    
    // 二十八宿
    const twentyEightStar = lunar.getTwentyEightStar();
    
    // 值神
    const duty = lunar.getDuty();
    
    // 十二建星
    const twelveStar = lunar.getTwelveStar();
    
    return {
      // 基本信息
      solarDate: `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日`,
      lunarDate: lunar.toString(),
      lunarMonthDays: `${lunarMonth.isLeap() ? '闰' : ''}${lunarMonth.getName()} ${lunarMonth.getDayCount()}天`,
      
      // 干支
      yearGanZhi: yearSixtyCycle.getName(),
      monthGanZhi: monthSixtyCycle.getName(),
      dayGanZhi: daySixtyCycle.getName(),
      
      // 生肖
      zodiac: lunarYear.getSixtyCycle().getEarthBranch().getZodiac().getName(),
      
      // 星座
      constellation: constellation.getName(),
      
      // 节气
      solarTerm: termDay.getDayIndex() === 0 ? term.getName() : `${term.getName()}后${termDay.getDayIndex()}天`,
      
      // 节日
      festival: lunarFestival?.getName() || solarFestival?.getName(),
      
      // 法定假日
      legalHoliday: legalHoliday ? `${legalHoliday.getName()}${legalHoliday.isWork() ? '(调休)' : '(休)'}` : null,
      
      // 宜忌
      recommends: recommends.map(t => t.getName()),
      avoids: avoids.map(t => t.getName()),
      
      // 其他
      nineStar: nineStar.toString(),
      twentyEightStar: twentyEightStar.getName(),
      duty: duty.getName(),
      twelveStar: twelveStar.getName(),
    };
  }, [selectedDate]);

  return (
    <MacModal isOpen={isOpen} onClose={onClose} title="万年历" width={680} height={520}>
      <div className="flex h-full">
        {/* 左侧日历 */}
        <div className="flex-1 p-4 border-r border-gray-200">
          <Calendar
            onDateSelect={handleDateSelect}
            showLunar={true}
            showSolarTerm={true}
            showFestival={true}
            className="shadow-none"
          />
        </div>
        
        {/* 右侧详情 */}
        <div className="w-64 p-4 overflow-y-auto bg-gray-50">
          {dateDetails ? (
            <div className="space-y-4">
              {/* 日期标题 */}
              <div className="text-center pb-3 border-b border-gray-200">
                <div className="text-2xl font-bold text-gray-800">
                  {selectedDate?.solar.getDay()}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {dateDetails.solarDate}
                </div>
                <div className="text-sm text-red-600 mt-1">
                  {dateDetails.lunarDate}
                </div>
                {dateDetails.festival && (
                  <div className="mt-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded inline-block">
                    {dateDetails.festival}
                  </div>
                )}
                {dateDetails.legalHoliday && (
                  <div className="mt-1 px-2 py-1 bg-green-100 text-green-600 text-xs rounded inline-block">
                    {dateDetails.legalHoliday}
                  </div>
                )}
              </div>
              
              {/* 干支信息 */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500 uppercase">干支</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white rounded p-2 shadow-sm">
                    <div className="text-xs text-gray-500">年</div>
                    <div className="text-sm font-medium">{dateDetails.yearGanZhi}</div>
                  </div>
                  <div className="bg-white rounded p-2 shadow-sm">
                    <div className="text-xs text-gray-500">月</div>
                    <div className="text-sm font-medium">{dateDetails.monthGanZhi}</div>
                  </div>
                  <div className="bg-white rounded p-2 shadow-sm">
                    <div className="text-xs text-gray-500">日</div>
                    <div className="text-sm font-medium">{dateDetails.dayGanZhi}</div>
                  </div>
                </div>
              </div>
              
              {/* 其他信息 */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500 uppercase">其他</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">生肖</span>
                    <span>{dateDetails.zodiac}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">星座</span>
                    <span>{dateDetails.constellation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">节气</span>
                    <span className="text-green-600">{dateDetails.solarTerm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">值神</span>
                    <span>{dateDetails.duty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">建星</span>
                    <span>{dateDetails.twelveStar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">二十八宿</span>
                    <span>{dateDetails.twentyEightStar}</span>
                  </div>
                </div>
              </div>
              
              {/* 宜忌 */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500 uppercase">宜忌</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-green-600 font-medium">宜：</span>
                    <span className="text-xs text-gray-600">
                      {dateDetails.recommends.join(' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-red-600 font-medium">忌：</span>
                    <span className="text-xs text-gray-600">
                      {dateDetails.avoids.join(' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              点击日期查看详情
            </div>
          )}
        </div>
      </div>
    </MacModal>
  );
}
