/** @jsxImportSource @emotion/react */
import {useState} from "react";
import {css} from "@emotion/react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useIsMounted} from "../hooks";
import {getCronJobs, startCronJob} from "../api/adminApis";
import RefreshButton from "../Components/crawlerPage/RefreshButton";
import {getPassedTime} from "../utils/utils";
import MyLoadingButton from "../Components/MyLoadingButton";
import {RowStack} from "../Components";
import CheckIcon from "../Components/crawlerPage/CheckIcon";


const CronJobs = () => {
    const [refreshing, setRefreshing] = useState(false);
    const queryClient = useQueryClient();
    const isMounted = useIsMounted();

    const getData = async () => {
        let result = await getCronJobs();
        if (result !== 'error') {
            return result;
        } else {
            throw new Error();
        }
    }

    const {data, isLoading, isFetching, isError} = useQuery(
        ['getCronJobs'],
        getData,
        {
            placeholderData: [],
            keepPreviousData: false,
            refetchInterval: 2 * 1000,
        }
    );

    const _onRefresh = async () => {
        setRefreshing(true);
        await queryClient.refetchQueries(['getCronJobs']);
        isMounted.current && setRefreshing(false);
    }

    const _onStart = async (jobName) => {
        setRefreshing(true);
        startCronJob(jobName);
        await queryClient.refetchQueries(['getCronJobs']);
        isMounted.current && setRefreshing(false);
    }

    if (isError) {
        return (
            <div css={style.container}>
                <span css={style.title}> CronJobs </span>
                --Error--
            </div>
        );
    }

    return (
        <div css={style.pageContainer}>
            <div css={style.container}>
                <span css={style.title}> CronJobs </span>
                <RefreshButton refreshing={refreshing || isLoading || isFetching} onClick={_onRefresh}/>

                <div css={style.fieldsContainer}>

                    {
                        (data && data.length > 0) && <>
                            {
                                data.map((jobData, index) => (
                                    <div css={style.JobContainer} key={jobData.jobName}>
                                        <RowStack>
                                            <span css={style.job}>{index + 1}. {jobData.jobName} </span>
                                            <span css={style.job}>Running: <CheckIcon isCheck={jobData.running}/> </span>
                                            <span
                                                css={style.job}>Start: {jobData.startDate ? getPassedTime(jobData.startDate) : 0} </span>
                                            <span css={style.job}>State: {jobData.state} </span>
                                            <span css={style.job}>Value: {jobData.value} </span>
                                            <span css={style.job}>Description: {jobData.description} </span>
                                        </RowStack>
                                        <MyLoadingButton
                                            disabled={isLoading || jobData.running}
                                            isLoading={isLoading || jobData.running}
                                            text={"Start"}
                                            onClick={() => _onStart(jobData.jobName)}
                                        />
                                    </div>
                                ))
                            }
                        </>
                    }

                </div>
            </div>
        </div>
    )
};

const style = {
    pageContainer: css({
        flex: 4,
    }),
    container: css({
        flex: 1,
        margin: '20px',
        padding: '20px',
        webkitBoxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
        boxShadow: '0px 0px 15px -10px rgba(0, 0, 0, 0.75)',
    }),
    title: css({
        fontSize: '22px',
        fontWeight: 600,
    }),
    fieldsContainer: css({
        marginTop: '20px',
        marginLeft: '10px',
    }),
    counter: css({
        position: 'absolute',
        right: 80,
        marginTop: '8px',
    }),
    JobContainer: css({
        display: 'flex',
        alignItems: 'center',
    }),
    job: css({
        marginTop: '10px',
        marginBottom: '10px',
        display: 'block',
    }),
    removeButton: css({
        position: 'absolute',
        right: 170,
    }),
};


export default CronJobs;
