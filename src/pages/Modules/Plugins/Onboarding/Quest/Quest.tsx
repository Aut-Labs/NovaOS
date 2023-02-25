import {
  useGetAllOnboardingQuestsQuery,
  useGetAllTasksPerQuestQuery
} from "@api/onboarding.api";
import { PluginDefinition, Task } from "@aut-labs-private/sdk";
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress
} from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { memo, useMemo, useState } from "react";
import { IsAdmin, allRoles } from "@store/Community/community.reducer";
import { useSelector } from "react-redux";
import LinkWithQuery from "@components/LinkWithQuery";
import AutTabs from "@components/AutTabs/AutTabs";
import { dateToUnix } from "@utils/date-format";
import { TaskStatus } from "@aut-labs-private/sdk/dist/models/task";
import { ethers } from "ethers";
import { TaskType } from "@aut-labs-private/sdk/dist/models/task";
import { QuestTasks } from "./QuestShared";
import OverflowTooltip from "@components/OverflowTooltip";
import Tasks from "../../Task/Shared/Tasks";

interface PluginParams {
  plugin: PluginDefinition;
}

// taskId?: number;
const demoTasks: Task[] = [
  {
    taskId: 1,
    createdOn: dateToUnix(new Date()),
    startDate: dateToUnix(new Date()),
    endDate: dateToUnix(new Date()),
    taskType: TaskType.TwitterFollow,
    status: TaskStatus.Created,
    creator: "0x55954C2C092f6e973B55C5D2Af28950b3b6D1338",
    taker: ethers.constants.AddressZero,
    role: 1,
    submitionUrl: "",
    metadataUri:
      "ipfs://bafkreib3lwy7kj2jyfuzx6wg4bqgqn4ums6eh6j32trsbvq7k2p6pusqoi",
    metadata: {
      name: "Task title 1",
      description: "Some task description",
      properties: {}
    }
  },
  {
    taskId: 1,
    createdOn: dateToUnix(new Date()),
    startDate: dateToUnix(new Date()),
    endDate: dateToUnix(new Date()),
    taskType: TaskType.TwitterFollow,
    status: TaskStatus.Submitted,
    creator: ethers.constants.AddressZero,
    taker: "0x55954C2C092f6e973B55C5D2Af28950b3b6D1338",
    role: 1,
    submitionUrl: "",
    metadataUri:
      "ipfs://bafkreib3lwy7kj2jyfuzx6wg4bqgqn4ums6eh6j32trsbvq7k2p6pusqoi",
    metadata: {
      name: "Task title 2",
      description: "Some task description",
      properties: {}
    }
  }
];

const Quest = ({ plugin }: PluginParams) => {
  const location = useLocation();
  const isAdmin = useSelector(IsAdmin);
  const params = useParams<{ questId: string }>();
  const [roles] = useState(useSelector(allRoles));

  const { data: allTasks, isLoading: isLoadingTasks } =
    useGetAllTasksPerQuestQuery(
      {
        questId: +params.questId,
        pluginAddress: plugin.pluginAddress
      },
      {
        refetchOnMountOrArgChange: false,
        skip: false
      }
    );

  const { quest, isLoading: isLoadingPlugins } = useGetAllOnboardingQuestsQuery(
    plugin.pluginAddress,
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        isLoading: isLoading || isFetching,
        quest: (data || []).find((q) => q.questId === +params?.questId)
      })
    }
  );

  const isLoading = useMemo(() => {
    return isLoadingPlugins || isLoadingTasks;
  }, [isLoadingTasks, isLoadingPlugins]);

  const role = useMemo(() => {
    return roles.find((r) => r.id === quest?.role);
  }, [roles, quest]);

  const { tasks, submissions } = useMemo(() => {
    return demoTasks.reduce(
      (prev, curr) => {
        if (curr.status === TaskStatus.Submitted) {
          prev.submissions = [...prev.submissions, curr];
        } else {
          prev.tasks = [...prev.tasks, curr];
        }
        return prev;
      },
      {
        tasks: [],
        submissions: []
      }
    );
  }, [allTasks]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: "20px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative"
      }}
    >
      {isLoading ? (
        <CircularProgress className="spinner-center" size="60px" />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            position: "relative"
          }}
        >
          <Typography textAlign="center" color="white" variant="h3">
            {quest?.metadata?.name}
          </Typography>

          <OverflowTooltip
            typography={{
              maxWidth: "400px"
            }}
            text={quest?.metadata?.description}
          />

          <Box
            sx={{
              display: "grid",
              alignItems: "center",
              mx: "auto",
              gridTemplateColumns: "1fr 1fr 1fr"
            }}
          >
            <Stack direction="column" alignItems="center">
              <Typography
                fontFamily="FractulAltBold"
                variant="subtitle2"
                color={quest?.active ? "success" : "error"}
              >
                {quest?.active ? "Active" : "Inactive"}
              </Typography>
              <Typography variant="caption" className="text-secondary">
                Status
              </Typography>
            </Stack>
            <Stack direction="column" alignItems="center">
              <Typography
                fontFamily="FractulAltBold"
                color="white"
                variant="subtitle2"
              >
                {new Date(quest?.startDate * 1000).toDateString()}
              </Typography>
              <Typography variant="caption" className="text-secondary">
                Start date
              </Typography>
            </Stack>
            <Stack direction="column" alignItems="center">
              <Typography
                fontFamily="FractulAltBold"
                color="white"
                variant="subtitle2"
              >
                {quest?.tasksCount}
              </Typography>
              <Typography variant="caption" className="text-secondary">
                Total tasks
              </Typography>
            </Stack>
          </Box>
        </Box>
      )}

      {!isLoading && !tasks?.length && (
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            mt: 12,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Typography className="text-secondary" variant="subtitle2">
            No tasks have been added to this quest yet...
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            size="medium"
            color="offWhite"
            to="/aut-dashboard/modules/Task"
            preserveParams
            queryParams={{
              questPluginAddress: plugin.pluginAddress,
              returnUrlLinkName: "See Quest",
              returnUrl: location.pathname,
              questId: params.questId
            }}
            component={LinkWithQuery}
          >
            Add first task
          </Button>
        </Box>
      )}

      {!isLoading && !!tasks.length && (
        <>
          {isAdmin && (
            <AutTabs
              tabStyles={{
                mt: 4,
                flex: 1
              }}
              tabs={[
                {
                  label: "Task",
                  props: {
                    isLoading,
                    tasks,
                    isAdmin,
                    questPluginAddress: plugin.pluginAddress,
                    questId: params.questId
                  },
                  component: QuestTasks
                },
                {
                  label: "Submissions",
                  props: {
                    isLoading,
                    isAdmin,
                    tasks: submissions,
                    questPluginAddress: plugin.pluginAddress,
                    questId: params.questId
                  },
                  component: QuestTasks
                }
              ]}
            />
          )}

          {!isAdmin && (
            <Tasks isAdmin={isAdmin} isLoading={isLoading} tasks={tasks} />
          )}
        </>
      )}
    </Container>
  );
};

export default memo(Quest);