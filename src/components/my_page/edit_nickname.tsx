import { useEffect, useRef, useState } from 'react';
import { userApi } from '@/api/user';

interface EditNicknameProps {
  currentNickname: string;
  onNicknameChange: (newNickname: string) => void;
  setShowNicknameEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditNickname({
  currentNickname,
  onNicknameChange,
}: EditNicknameProps) {
  const [newNickname, setNewNickname] = useState('');
  const [isNicknameVerified, setIsNicknameVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showNicknameEdit, setShowNicknameEdit] = useState(false);

  const editBoxRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 편집창 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editBoxRef.current &&
        !editBoxRef.current.contains(event.target as Node)
      ) {
        setShowNicknameEdit(false);
        setIsError(false);
        setErrorMessage('');
        setIsNicknameVerified(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNicknameCheck = async () => {
    if (!newNickname) return;
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await userApi.validateNickname(newNickname);

      if (response.exists) {
        setIsError(true);
        setErrorMessage(response.message);
      } else {
        setIsNicknameVerified(true);
        setErrorMessage('');
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage('서버 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 닉네임 변경 요청
  const handleSave = async () => {
    if (!isNicknameVerified) return;
    try {
      await userApi.updateNickname(newNickname);
      onNicknameChange(newNickname);
      setShowNicknameEdit(false);
    } catch (error) {
      console.error('닉네임 변경 실패:', error);
      setIsError(true);
      setErrorMessage('닉네임 변경에 실패했습니다.');
    }
  };

  return (
    <div className="w-[452px] max-md:w-full">
      <span className="text-xl font-semibold">닉네임</span>
      <div className="flex justify-between items-center mt-6 border-b border-[var(--grayscale-40)]">
        <span className="text-[18px]">{currentNickname}</span>
        <button
          className="w-[59px] h-[24px] rounded-[24px] bg-[var(--primary-w80)] border border-[var(--primary-b20)] hover:bg-[var(--primary-w40)] text-xs mb-[9.5px]"
          onClick={() => setShowNicknameEdit(true)}
        >
          변경하기
        </button>
      </div>

      {showNicknameEdit && (
        <div
          ref={editBoxRef}
          className="w-[920px] h-[180px] max-md:w-full max-md:h-full flex max-md:flex-col max-md:gap-2 bg-[#F9F9F9] border border-[#D9D9D9] rounded-[12px] justify-center px-[24px] mt-6 gap-3"
        >
          <div className="max-md:mt-2 flex flex-col justify-center">
            <label
              className="text-[18px] font-semibold mb-3"
              htmlFor="new-nickname"
            >
              새로운 닉네임
            </label>
            <input
              id="new-nickname"
              type="text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="w-[480px] h-[60px] max-md:w-full bg-grayscale-0 text-sm p-2 border border-[#D9D9D9] rounded-[8px]"
              placeholder="새로운 닉네임을 입력하세요.."
              disabled={isLoading || isNicknameVerified}
            />
            {isError && (
              <p className="text-xs text-[#eb165d] mt-2">{errorMessage}</p>
            )}
            {isNicknameVerified && (
              <p className="text-xs mt-2">*사용 가능한 닉네임입니다.</p>
            )}
          </div>

          <div className="flex gap-2 mt-7 items-center max-md:mb-2">
            <button
              className="w-[180px] h-[60px] bg-grayscale-0 border border-[var(--primary-b60)] text-[var(--primary-b60)] text-sm max-md:text-xs font-semibold rounded-[12px]"
              onClick={handleNicknameCheck}
              disabled={!newNickname || isNicknameVerified || isLoading}
            >
              {isLoading
                ? '처리 중...'
                : isNicknameVerified
                  ? '확인완료'
                  : '중복확인'}
            </button>

            <button
              className={`w-[180px] h-[60px] text-sm max-md:text-xs px-4 py-2 rounded-[12px] bg-[var(--primary)] font-semibold cursor-pointer ${
                !isNicknameVerified ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleSave}
              disabled={!isNicknameVerified}
            >
              닉네임 변경
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
