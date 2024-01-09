import React, {FC} from 'react';
import Reply from './Reply';
import {ReplyDTO, ReplyEntities} from './BoardDetail';
import {BoardDTO} from '../BoardPage';

type RecursiveRepliesProps = {
  memberId: string | null;
  panelId: string;
  replyCount: number;
  replyEntities: ReplyEntities;
  setBoardDTOList: React.Dispatch<
    React.SetStateAction<BoardDTO[] | null | undefined>
  >;
  setReplyDTOList: React.Dispatch<
    React.SetStateAction<ReplyDTO[] | null | undefined>
  >;
  parentNickname: string | null;
  replies: string[];
};

const RecursiveReplies: FC<RecursiveRepliesProps> = ({
  memberId,
  panelId,
  replyCount,
  replyEntities,
  setBoardDTOList,
  setReplyDTOList,
  parentNickname,
  replies
}) => {
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
              replyCount={replyCount}
              setBoardDTOList={setBoardDTOList}
              setReplyDTOList={setReplyDTOList}
            />
            {replyEntities[replyId].replies.length > 0 && (
              <RecursiveReplies
                memberId={memberId}
                panelId={panelId}
                replyCount={replyCount}
                replyEntities={replyEntities}
                setBoardDTOList={setBoardDTOList}
                setReplyDTOList={setReplyDTOList}
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

export default React.memo(RecursiveReplies);
