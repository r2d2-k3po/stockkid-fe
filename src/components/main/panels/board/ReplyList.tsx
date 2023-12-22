import React, {FC, useState} from 'react';
import {EditorRef, ReplyDTO} from '../BoardPage';
import {useTranslation} from 'react-i18next';
import {useAppDispatch, useAppSelector} from '../../../../app/hooks';
import ReplyEditor from './ReplyEditor';
import {BoardPageState} from '../../../../app/constants/panelInfo';

type ReplyEntity = {
  replyDTO: ReplyDTO | null;
  replies: string[];
};
type ReplyEntitiesType = Record<string, ReplyEntity>;

type ReplyListProps = {
  memberId: string | null;
  panelId: string;
  boardId: string;
  replyDTOList: ReplyDTO[] | null | undefined;
  loadBoard: (boardId: string | null, setContent: boolean) => Promise<void>;
  replyEditorRef: React.MutableRefObject<EditorRef | null>;
};

const ReplyList: FC<ReplyListProps> = ({
  memberId,
  panelId,
  boardId,
  replyDTOList,
  loadBoard,
  replyEditorRef
}) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();

  const boardPageState = useAppSelector((state) => state.panels).entities[
    panelId
  ]?.panelState as BoardPageState;

  const [parentId, setParentId] = useState<string | null>(
    boardPageState.parentId
  );

  const replyEntities: ReplyEntitiesType = {};
  replyEntities['board'] = {
    replyDTO: null,
    replies: []
  };
  replyDTOList?.forEach((replyDTO) => {
    replyEntities[replyDTO.replyId] = {
      replyDTO: replyDTO,
      replies: []
    };
    if (replyDTO.parentId == null) {
      replyEntities['board'].replies[replyEntities['board'].replies.length] =
        replyDTO.replyId;
    } else {
      replyEntities[replyDTO.parentId].replies[
        replyEntities[replyDTO.parentId].replies.length
      ] = replyDTO.replyId;
    }
  });

  return (
    <div>
      <div className="m-2 h-36 border-2">ReplyList</div>
    </div>
  );
};

export default React.memo(ReplyList);
