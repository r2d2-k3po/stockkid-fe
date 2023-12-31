import React, {FC, MouseEvent, useMemo} from 'react';
import {EditorRef, ReplyDTO} from './BoardDetail';
import {useAppSelector} from '../../../../app/hooks';
import {BoardPageState} from '../../../../app/constants/panelInfo';
import Reply from './Reply';
import ReplyEditor from './ReplyEditor';

type ReplyEntity = {
  replyDTO: ReplyDTO | null;
  replies: string[];
};
type ReplyEntitiesType = Record<string, ReplyEntity>;

type RecursiveRepliesProps = {
  parentNickname: string | null;
  replies: string[];
};

type ReplyListProps = {
  memberId: string | null;
  panelId: string;
  boardId: string;
  replyDTOList: ReplyDTO[] | null | undefined;
  loadBoard: (boardId: string | null, setContent: boolean) => Promise<void>;
  replyEditorRef: React.MutableRefObject<EditorRef | null>;
  enableReplyEditor: (
    parentId: string | null
  ) => (e: MouseEvent<HTMLButtonElement>) => void;
  resetReplyEditorState: () => void;
};

const ReplyList: FC<ReplyListProps> = ({
  memberId,
  panelId,
  boardId,
  replyDTOList,
  loadBoard,
  replyEditorRef,
  enableReplyEditor,
  resetReplyEditorState
}) => {
  const boardPageState = useAppSelector((state) => state.panels).entities[
    panelId
  ]?.panelState as BoardPageState;

  const replyEntities: ReplyEntitiesType = useMemo(() => {
    const entities: ReplyEntitiesType = {};
    entities['board'] = {
      replyDTO: null,
      replies: []
    };
    replyDTOList?.forEach((replyDTO) => {
      entities[replyDTO.replyId] = {
        replyDTO: replyDTO,
        replies: []
      };
      if (replyDTO.parentId == null) {
        entities['board'].replies[entities['board'].replies.length] =
          replyDTO.replyId;
      } else {
        entities[replyDTO.parentId].replies[
          entities[replyDTO.parentId].replies.length
        ] = replyDTO.replyId;
      }
    });
    return entities;
  }, [replyDTOList]);

  const RecursiveReplies = ({
    parentNickname,
    replies
  }: RecursiveRepliesProps) => {
    return (
      <div className="pl-3">
        {replies.length > 0 &&
          replies.map((replyId) => {
            return (
              <div key={replyId}>
                {!(
                  boardPageState.showReplyEditor &&
                  boardPageState.replyId == replyId
                ) && (
                  <Reply
                    key={replyId}
                    memberId={memberId}
                    panelId={panelId}
                    boardId={boardId}
                    loadBoard={loadBoard}
                    parentNickname={parentNickname}
                    replyDTO={replyEntities[replyId].replyDTO as ReplyDTO}
                    replyEditorRef={replyEditorRef}
                    enableReplyEditor={enableReplyEditor}
                  />
                )}
                {boardPageState.showReplyEditor &&
                  boardPageState.parentId == replyId && (
                    <ReplyEditor
                      panelId={panelId}
                      boardId={boardId}
                      replyEditorRef={replyEditorRef}
                      loadBoard={loadBoard}
                      resetReplyEditorState={resetReplyEditorState}
                    />
                  )}
                <RecursiveReplies
                  parentNickname={
                    replyEntities[replyId].replyDTO?.nickname as string
                  }
                  replies={replyEntities[replyId].replies}
                />
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <div className="m-2">
      {boardPageState.showReplyEditor && boardPageState.parentId == null && (
        <ReplyEditor
          panelId={panelId}
          boardId={boardId}
          replyEditorRef={replyEditorRef}
          loadBoard={loadBoard}
          resetReplyEditorState={resetReplyEditorState}
        />
      )}
      <RecursiveReplies
        parentNickname={null}
        replies={replyEntities['board'].replies}
      />
    </div>
  );
};

export default React.memo(ReplyList);
