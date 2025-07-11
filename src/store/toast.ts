import { create } from 'zustand';

/**
 * 토스트 상태 관리 인터페이스
 *
 * 토스트 알림과 관련된 상태와 액션들을 정의합니다.
 *
 * 상태:
 * - isVisible: 토스트 표시 여부
 * - message: 토스트에 표시될 메시지
 *
 * 액션:
 * - showToast: 토스트 표시 함수
 * - hideToast: 토스트 숨김 함수
 *
 * 기술적 특징:
 * - 간단한 상태 관리로 빠른 토스트 표시
 * - 전역 상태로 컴포넌트 간 토스트 공유
 * - Zustand를 통한 효율적인 상태 업데이트
 *
 * 사용자 경험:
 * - 일시적인 알림 메시지 표시
 * - 자동으로 사라지는 토스트 알림
 * - 사용자 액션에 대한 즉각적인 피드백
 */
interface ToastState {
  isVisible: boolean;
  message: string;
  showToast: (message: string) => void;
  hideToast: () => void;
}

/**
 * 토스트 상태 관리 스토어
 *
 * Zustand를 사용하여 토스트 알림을 전역적으로 관리합니다.
 *
 * 주요 기능:
 * 1. 토스트 표시/숨김 상태 관리
 * 2. 토스트 메시지 동적 설정
 * 3. 컴포넌트 간 토스트 공유
 * 4. 간단하고 빠른 알림 시스템
 *
 * 상태 관리:
 * - isVisible: 토스트의 표시/숨김 상태
 * - message: 토스트에 표시될 메시지 텍스트
 * - showToast: 토스트를 표시하는 함수
 * - hideToast: 토스트를 숨기는 함수
 *
 * 사용자 경험:
 * - 직관적인 알림 시스템
 * - 일시적인 피드백 제공
 * - 방해받지 않는 사용자 경험
 * - 일관된 알림 스타일
 *
 * 기술적 특징:
 * - Zustand를 통한 상태 관리
 * - TypeScript를 통한 타입 안전성
 * - 간단한 API로 쉬운 사용
 * - 메모리 효율적인 상태 관리
 *
 * 확장성:
 * - 토스트 타입 추가 가능 (성공, 에러, 경고 등)
 * - 지속 시간 설정 기능 추가 가능
 * - 토스트 스택 관리 기능 추가 가능
 * - 애니메이션 효과 추가 가능
 */
export const useToastStore = create<ToastState>((set) => ({
  /**
   * 토스트 표시 여부
   *
   * 토스트가 현재 화면에 표시되고 있는지 여부를 나타냅니다.
   * false: 토스트 숨김, true: 토스트 표시
   *
   * 사용 시나리오:
   * - 토스트 컴포넌트의 조건부 렌더링
   * - 토스트 애니메이션 제어
   * - 토스트 오버레이 표시 제어
   */
  isVisible: false,

  /**
   * 토스트 메시지
   *
   * 토스트에 표시될 메시지 텍스트입니다.
   * 빈 문자열일 경우 토스트가 표시되지 않습니다.
   *
   * 메시지 예시:
   * - "저장되었습니다."
   * - "로그인이 필요합니다."
   * - "네트워크 오류가 발생했습니다."
   * - "업로드가 완료되었습니다."
   */
  message: '',

  // ===== 액션 함수들 =====

  /**
   * 토스트 표시 함수
   *
   * 토스트를 화면에 표시하고 메시지를 설정합니다.
   *
   * 처리 과정:
   * 1. isVisible을 true로 설정하여 토스트 표시
   * 2. 전달받은 message를 상태에 설정
   * 3. 토스트 컴포넌트에서 메시지 렌더링
   *
   * 사용 시나리오:
   * - 사용자 액션 성공 시 알림
   * - 에러 발생 시 알림
   * - 정보성 메시지 표시
   * - 작업 완료 알림
   *
   * 예시:
   * ```typescript
   * showToast('저장되었습니다.');
   * showToast('로그인이 필요합니다.');
   * showToast('업로드가 완료되었습니다.');
   * ```
   *
   * 자동 숨김:
   * - 일반적으로 3-5초 후 자동으로 숨김
   * - 사용자가 토스트를 클릭하여 수동 숨김 가능
   * - ESC 키로 토스트 숨김 가능
   *
   * @param message - 토스트에 표시할 메시지
   */
  showToast: (message: string) => set({ isVisible: true, message }),

  /**
   * 토스트 숨김 함수
   *
   * 토스트를 화면에서 숨기고 메시지를 초기화합니다.
   *
   * 처리 과정:
   * 1. isVisible을 false로 설정하여 토스트 숨김
   * 2. message를 빈 문자열로 초기화
   * 3. 토스트 컴포넌트에서 화면에서 제거
   *
   * 사용 시나리오:
   * - 자동 타이머 만료 시
   * - 사용자가 토스트 클릭 시
   * - ESC 키 입력 시
   * - 프로그래밍적으로 토스트 닫기
   * - 새로운 토스트 표시 전 기존 토스트 정리
   *
   * 장점:
   * - 메모리 누수 방지
   * - 깨끗한 상태 보장
   * - 다음 토스트 표시 시 안전한 시작
   * - 일관된 토스트 동작
   *
   * 자동 호출:
   * - 토스트 컴포넌트 내부에서 타이머로 자동 호출
   * - 사용자 인터랙션으로 수동 호출
   * - 컴포넌트 언마운트 시 자동 호출
   */
  hideToast: () => set({ isVisible: false, message: '' }),
}));
