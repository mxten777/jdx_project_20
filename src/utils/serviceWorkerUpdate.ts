// 최초 서비스워커 설치(controller: none -> active)와 기존 서비스워커의 실제 업데이트를 구분한다.
export const shouldShowUpdateBanner = (hadControllerAtLoad: boolean): boolean => hadControllerAtLoad;
