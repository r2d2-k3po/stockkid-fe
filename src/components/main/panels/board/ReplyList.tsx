import React, {FC, useMemo} from 'react';
import {ReplyDTO} from './BoardDetail';
import {useAppSelector} from '../../../../app/hooks';
import {BoardPageState} from '../../../../app/constants/panelInfo';
import Reply from './Reply';
import {BoardDTO} from '../BoardPage';

type ReplyEntity = {
  replyDTO: ReplyDTO | null;
  replies: string[];
};

type ReplyEntities = Record<string, ReplyEntity>;

type RecursiveRepliesProps = {
  parentNickname: string | null;
  replies: string[];
};

type ReplyListProps = {
  memberId: string | null;
  panelId: string;
  replyDTOList: ReplyDTO[] | null | undefined;
  setBoardDTOList: React.Dispatch<
    React.SetStateAction<BoardDTO[] | null | undefined>
  >;
  setReplyDTOList: React.Dispatch<
    React.SetStateAction<ReplyDTO[] | null | undefined>
  >;
};

const ReplyList: FC<ReplyListProps> = ({
  memberId,
  panelId,
  replyDTOList,
  setBoardDTOList,
  setReplyDTOList
}) => {
  const boardPageState = useAppSelector((state) => state.panels).entities[
    panelId
  ]?.panelState as BoardPageState;

  const replyEntities: ReplyEntities = useMemo(() => {
    const entities: ReplyEntities = {};
    entities['board'] = {
      replyDTO: null,
      replies: []
    };
    replyDTOList?.forEach((replyDTO) => {
      entities[replyDTO.replyId as string] = {
        replyDTO: replyDTO,
        replies: []
      };
      if (replyDTO.parentId == null) {
        entities['board'].replies[entities['board'].replies.length] =
          replyDTO.replyId as string;
      } else {
        entities[replyDTO.parentId].replies[
          entities[replyDTO.parentId].replies.length
        ] = replyDTO.replyId as string;
      }
    });
    if (boardPageState.showReplyEditor && boardPageState.replyId == null) {
      entities['newReply'] = {
        replyDTO: {
          replyId: null,
          parentId: boardPageState.parentId,
          memberId: memberId,
          nickname: null,
          content: null,
          likeCount: null,
          regDate: null,
          modDate: null
        },
        replies: []
      };
      if (boardPageState.parentId == null) {
        entities['board'].replies[entities['board'].replies.length] =
          'newReply';
      } else {
        entities[boardPageState.parentId].replies[
          entities[boardPageState.parentId].replies.length
        ] = 'newReply';
      }
    }
    return entities;
  }, [
    memberId,
    replyDTOList,
    boardPageState.showReplyEditor,
    boardPageState.replyId,
    boardPageState.parentId
  ]);

  const RecursiveReplies = ({
    parentNickname,
    replies
  }: RecursiveRepliesProps) => {
    return (
      <div className="pl-3">
        {replies.map((replyId) => {
          return (
            <div key={replyId}>
              <Reply
                memberId={memberId}
                panelId={panelId}
                parentNickname={parentNickname}
                replyDTO={replyEntities[replyId].replyDTO as ReplyDTO}
                replyCount={replyDTOList?.length}
                setBoardDTOList={setBoardDTOList}
                setReplyDTOList={setReplyDTOList}
              />
              {replyEntities[replyId].replies.length > 0 && (
                <RecursiveReplies
                  parentNickname={
                    replyEntities[replyId].replyDTO?.nickname as string
                  }
                  replies={replyEntities[replyId].replies}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="m-2">
      {replyEntities['board'].replies.length > 0 && (
        <RecursiveReplies
          parentNickname={null}
          replies={replyEntities['board'].replies}
        />
      )}
    </div>
  );
};

export default React.memo(ReplyList);
