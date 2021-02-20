import {React, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import AppCard from "./AppCard";
import styles from "../../assets/jss/apps/AppListStyle";
import InfiniteScroll from "react-infinite-scroll-component";
import Spiner from './Spiner'

const useStyles = makeStyles(styles);

const AppsList = ({ newData }) => {
  const classes = useStyles();
  // const [data, setData] = useState(newData);

  const [items, setItems] = useState(Array.from({ length: 12 }));
  const [alldata, setalldata] = useState([]);

  useEffect(() => {
    // console.log(items.length);
    if (items.length && newData) {
      const indexOfLastTodo = 1 * items.length;
      const indexOfFirstTodo = indexOfLastTodo - items.length;
      const currentTodos = newData?.slice(indexOfFirstTodo, indexOfLastTodo);
      setalldata(currentTodos);
    }
  }, [items.length, newData]);

  const fetchMoreData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    setTimeout(() => {
      setItems(items.concat(Array.from({ length: 12 })));
      //   this.setState({
      //     items: this.state.items.concat(Array.from({ length: 20 })),
      //   });
    }, 1500);
  };

  return (
    <div className={`${classes.listContain} list-grid-container`}>
      <InfiniteScroll
        scrollableTarget='app-content'
        className="infinite"
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={alldata.length === newData.length ? false : true}
        loader={<Spiner />}
        // endMessage={<h3>End of Apps</h3>}
      >
        <Grid container spacing={1} id="appsInfinteScroll">
          {alldata &&
            alldata.map((item, index) => {
              return (
                <Grid item xs={6} sm={6} md={4} lg={3} xl={3} key={index}>
                  <AppCard selectable={true} item={item} />
                </Grid>
              );
            })}
        </Grid>
      </InfiniteScroll>
    </div>
  );
};

export default AppsList;
