// /lib/firebase-indexes.ts
/**
 * Firebase 인덱스 생성 안내
 *
 * 다음 쿼리를 사용하기 위해서는 Firebase 콘솔에서 인덱스를 생성해야 합니다:
 *
 * 1. quotes 컬렉션에 대한 복합 인덱스:
 *    - 필드: userId (Ascending), createdAt (Descending)
 *
 * 인덱스 생성 방법:
 * 1. Firebase 콘솔에 로그인합니다.
 * 2. 프로젝트를 선택합니다.
 * 3. Firestore Database > 인덱스 탭으로 이동합니다.
 * 4. "복합 인덱스 추가" 버튼을 클릭합니다.
 * 5. 컬렉션 ID: quotes
 * 6. 필드 경로: userId (Ascending)
 * 7. 필드 경로: createdAt (Descending)
 * 8. 쿼리 범위: 컬렉션
 * 9. "인덱스 생성" 버튼을 클릭합니다.
 *
 * 또는 다음 URL을 통해 직접 인덱스를 생성할 수 있습니다:
 * https://console.firebase.google.com/v1/r/project/computerzone-176e4/firestore/indexes?create_composite=ClFwcm9qZWN0cy9jb21wdXRlcnpvbmUtMTc2ZTQvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL3F1b3Rlcy9pbmRleGVzL18QARoKCgZ1c2VySWQQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC
 */

export {}

