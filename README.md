### 프로젝트 StockKid

**컨셉** : HTS (Home Trading System) 의 웹 버전 + 커뮤니티 + AI를 활용한 분석/자동매매 시스템

**개발자로서의 초기 목표** : 프론트엔드, 백엔드, 그리고 배포까지 경험하여 개발의 전반적인 과정에 대한 이해도를 높임으로써 향후 고급 개발 능력을 갖추기 위한 기반을 마련합니다.

**버전 관리** : Git, GitHub

**프론트엔드** : TypeScript, React, Tailwind CSS, daisyUI, i18next, React Router, Redux Toolkit, RTK Query, React-Grid-Layout, Remirror

https://github.com/r2d2-k3po/stockkid-fe

**백엔드** : Java, Spring Boot, Spring Data JPA, Spring Security, PostgreSQL

https://github.com/r2d2-k3po/stockkid-be

**배포** : AWS Route 53, Certificate Manager, S3, CloudFront, API Gateway, EC2, RDS

https://stockkid.net

------------------------------------------------------------------------------------------------------

**프론트엔드 주요 설계 포인트** : 여러 개의 가상 스크린들과 각 가상 스크린 내 다양한 기능을 수행할 수 있는 패널들의 자유로운 추가, 삭제 및 이동이 가능해야 하며, 또한 이들의 상태를 관리해야 합니다.

**Client-side routing** : SPA (Single Page Application) 로서 각 가상 스크린 내 다양한 패널들은 동등한 수준에서 동시에 존재하므로 client-side routing 을 적용하기 곤란하며, 따라서 client-side routing 은 가상 스크린 레벨에서만 적용합니다. 단 네이버나 카카오의 소셜 로그인시 뜨는 팝업창에서의 callback 경로는 예외로 합니다.

**가상 스크린과 패널들의 상태 관리** :

  Redux Toolkit 의 createSlice 와 configureStore 함수를 사용하여 상태를 관리하며, 초기 구현에서는 nested map 구조를 채택하여 상태 관리 자체는 정상적으로 작동하였으나, plain JS object 와 array 만 취급하는  Redux store 의 특성상 Redux DevTools 에서의 상태 변경 추적이 어려움을 발견하였습니다. 
 
 따라서 plain JS object 구조를 채택한 리팩터링을 결정하고, 더 나아가 Redux Toolkit 의 createEntityAdapter 함수를 이용하여 가상 스크린과 패널들의 normalized state structure 를 구축하였습니다.

한편 가상 스크린에 종속되는 패널들의 특성상 가상 스크린과 패널들의 상태를 동시에 변경해야 하는 경우가 많은데, 가상 스크린과 패널들의 상태를 각각 변경하는 여러 action 들을 순차적으로 dispatch 하는 기존 방식으로부터 하나의 action 만 dispatch 후 가상 스크린의 reducer 와 이에 대응하는 패널들의 extraReducers 가 해당 action 을 함께 처리하는 방식으로 리팩터링하여 상태 변경이 효율적으로 처리되도록 하였습니다.

Remirror 를 에디터로 사용하는 게시판 패널의 경우 상태 관리의 복잡성이 증가합니다. 우선 한 패널 내 여러 개의 에디터 컴포넌트가 동시에 editable 모드로 마운트 될 경우 버벅거리는 현상이 발생할 수 있습니다. 또한 사용 후 제대로 언마운트되지 않을 경우 이전 상태가 리셋되지 않아 깜박임 등 예측하지 못한 결과로 보여질 수 있습니다. 패널에는 패널의 종류를 나타내는 panelCode 뿐 아니라 각 패널의 상태를 저장하기 위한 panelState 라는 object 를 속성으로 두는데, 게시판 패널의 경우에는 mountBoardDetail, showBoardEditor 와 showReplyEditor 라는 속성을 panelState 의 내부 속성으로 사용하여 에디터를 사용하는 BoardDetail 컴포넌트를 마운트할 것인지, 게시글 또는 댓글을 위한 에디터를 editable 모드로 마운트할 것인지 등을 각각 정하며, 이를 이용해 한번에 하나의 에디터만 editable 모드로 마운트 되도록 하며 또한 불필요한 에디터가 언마운트 되도록 합니다.

editable 모드로 마운트 되는 에디터의 또다른 문제점은, edit 작업이 완료 또는 취소된 후 의도적이며 정상적으로 언마운트 되는 경우와 달리, 현재 가상 스크린을 변경하여 이전 가상 스크린의 모든 패널들이 언마운트 되면서 edit 작업 중이던 임시 상태 정보가 사용자의 의도와 달리 유실될 수 있다는 점입니다. edit 작업 중 텍스트 타이핑 등의 변경 사항이 발생할 때마다 매번 임시 상태 정보를 저장하게 되면 성능상 문제가 될 수 있기 때문에, 현재 가상 스크린을 변경하는 등 사용자의 의도와 달리 에디터가 언마운트 되는 경우에만 이를 감지하여 텍스트의 변경 사항 등 임시 상태 정보를 저장하고 에디터가 다시 마운트 될 때 이 정보를 다시 불러올 필요가 있습니다. 다만 에디터가 언마운트 되는지 또는 텍스트의 변경 사항이 있는지 등의 상태 자체를 Redux Toolkit 으로 관리하게 되면 이 상태가 반영되는 타이밍이 느려서 실제 에디터가 언마운트 될 때 이 상태 정보를 사용하기 어려우므로, 텍스트의 변경 사항이 있는지의 상태를 저장하는 needSaveText 와 에디터가 언마운트 되는지의 상태를 저장하는 mounted 상수를 useRef 훅으로 정의하여 상태를 관리하며, 이를 이용하여 임시 상태 정보를 저장할 필요가 있는지 판단하게 됩니다.


**게시판 패널 게시글 내 댓글들의 배치 구현** :

백엔드 서버로부터 리스트 형태로 불러오는 댓글들의 정보에는 자기 자신의 id 인 replyId 와 부모 게시글 또는 댓글의 id 인 parentId 가 포함되어 있습니다. 기존 댓글들 뿐 아니라 새 댓글을 위한 에디터까지 포함하여 parentId 에 따라 위치를 정해 배치해야 합니다.
우선 createEntityAdapter 에서 사용하는 Entity 타입을 응용하여 현재 댓글의 모든 정보를 담고 있는 replyDTO 와 현재 댓글의 자식 댓글들의 replyId 들의 리스트인 replies 를 속성으로 가지는 ReplyEntity 타입을 다음과 같이 정의합니다.

type ReplyEntity = {
replyDTO: ReplyDTO | null;
replies: string[];
};

전체 댓글들의 배치를 포함한 정보를 위해서는 현재 댓글의 replyId 를 키로, 그리고 현재 댓글의 ReplyEntity 를 값으로 가지는 Record 타입을 사용합니다. 단, 현재 글이 게시글 또는 새 댓글을 가리킬 경우에는 각각 'board' 또는 'newReply' 를 replyId 대신 사용합니다.

type ReplyEntities = Record<string, ReplyEntity>;

현재 댓글의 ReplyEntity 의 replyDTO 정보를 표시한 후 replies 에 담긴 replyId 들을 키로 가지는 Record 의 ReplyEntity  들을 재귀적으로 찾아가게 되면 깊이 우선 탐색 방식으로 전체 댓글들을 배치할 수 있습니다.


**게시판 게시글 목록 프리뷰 및 게시글 내 댓글 표시 정보 동기화** :

게시글 로딩, 등록, 수정, 삭제, 추천시 또는 댓글 등록시 게시글 목록 프리뷰에 보여지는 추천수, 댓글수를 포함하는 각종 게시글 요약 표시 정보를 동기화할 필요가 있습니다. 마찬가지로 댓글 등록, 수정, 삭제, 추천시 게시글 내 댓글들의 배치 및 표시 정보를 동기화해야 합니다. 이를 위해 전자의 경우 게시글 목록 전체를 백엔드 서버로부터 다시 로딩한다거나 후자의 경우 게시글 전체를 다시 로딩하는 것은 비효율적입니다. 동기화에 필요한 정보는 이미 가지고 있으므로 부모 컴포넌트로부터 자식 컴포넌트로 setState 함수를 props 로 내려 보내어 해당 정보를 갱신하도록 합니다.

------------------------------------------------------------------------------------------------------

# stockkid-fe
project StockKid frontend

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
