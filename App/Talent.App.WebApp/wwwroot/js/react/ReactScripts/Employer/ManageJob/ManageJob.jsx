﻿import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import moment from 'moment';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Button, Card, Image, Menu } from 'semantic-ui-react';


export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            mainMenuIndex: 1,
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            activeIndex: 0,
            loadStatus: false,
            currentPage: 1,
            totalPages: 1

        }
        this.handleClick1 = this.handleClick1.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.pageChange = this.pageChange.bind(this);
       
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        // this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
           this.setState({ loaderData })
        )
        
        console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        // var link = 'http://competitiontask1talent.azurewebsites.net/listing/listing/getSortedEmployerJobs';

        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';

        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here

       $.ajax({
        url: link,
        headers: {
            'Authorization': 'Bearer ' + cookies,
            'Content-Type': 'application/json'
        },
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        data: {
            activePage: this.state.activePage,
            sortByDate: this.state.sortBy.date,
            showActive: this.state.filter.showActive,
            showClosed: this.state.filter.showClosed,
            showDraft: this.state.filter.showDraft,
            showExpired: this.state.filter.showExpired,
            showUnexpired: this.state.filter.showUnexpired
        },
        success: function (res) {
            if (res.success == true) {
                TalentUtil.notification.show(res.message, "success", null, null);
                this.setState({ loadStatus: true, loadJobs: res.myJobs, totalPages: Math.ceil(res.totalCount / 2) }, callback);
                console.log("totalcount"+res.totalCount)
                console.log("myjob"+res.myJobs);
                if((this.state.currentPage > res.myJobs.length)){
                    console.log("Last Page = Current page");
                    this.setState({
                        currentPage: this.state.currentPage == 1 ? 1 : this.state.currentPage - 1, 
                    });
                }

            } else {
                TalentUtil.notification.show(res.message, "error", null, null)
                console.log(res.message);
            }}.bind(this)
    })

    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }


    pageChange(e,pagData){
        this.setState({currentPage: pagData.activePage,
                        totalPages: pagData.totalPages
                    })
        console.log(pagData);
    }
    
    
    handleSort(e, { value, name }) {
        // debugger;
        this.state.sortBy.date = value;
        this.setState({sortBy: this.state.sortBy})
        
        
        console.log(name)
        console.log(value)
        
       
    }
    
    handleFilter(e, { checked, name }) {
        this.state.filter[name] = checked;
        this.setState({
            filter: this.state.filter
        })
    }
    
    handleClick(e, titleProps) {
        console.log("HandleClick");
        console.log(titleProps);
        const { index } = titleProps
         const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
        this.setState({ activeIndex: newIndex })
    }


    handleClick1(e, titleProps) {
        console.log("HandleClick1");
        console.log(titleProps);
        const { index } = titleProps;
        console.log("HandleClick1---Index");
        const { mainMenuIndex } = this.state;
        console.log("HandleClick1----mainMenuIndex");
        const newIndex = mainMenuIndex === index ? -1 : index
    
        this.setState({ mainMenuIndex: newIndex })
    }
    



    render() {
        var jblist= this.state.loadJobs;
        var result = undefined;
        console.log(jblist);
        const { activeIndex } = this.state;
        const { mainMenuIndex } = this.state;

        if(this.state.loadStatus){
        if(this.state.loadJobs.length > 0)
        {
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
               <div className ="ui container"><h1>List of Jobs</h1>
               

               <Accordion as={Menu} vertical >
                <Menu.Item>
                    <Accordion.Title active={mainMenuIndex === 0} index={0} onClick={this.handleClick1} >
                    <Icon name='filter'/> {"Filter:"}
                    <Icon name='dropdown' />
                    </Accordion.Title>
                    <Accordion.Content active={mainMenuIndex === 0} >    
                    
                <Accordion as={Menu} vertical>
                    <Menu.Item>
                        <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                   
                    <Icon name='dropdown' />
                    By Status
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0} >    
                    <Form>
                    <Form.Group grouped>
                    <Checkbox label='Active Jobs'
                        name="showActive" onChange={this.handleFilter} checked={this.state.filter.showActive} />
                    <Checkbox label='Closed Jobs'
                        name="showClosed" onChange={this.handleFilter} checked={this.state.filter.showClosed} />
                    <Checkbox label='Drafts'
                        name="showDraft" onChange={this.handleFilter} checked={this.state.filter.showDraft} />
                    </Form.Group>
                    </Form>
                        </Accordion.Content>
                    </Menu.Item>
                </Accordion>
        
                    <Accordion as={Menu} vertical>  
                        <Menu.Item>
                            <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
                                <Icon name='dropdown' />
                                    By Expiry Date
                            </Accordion.Title>
                        <Accordion.Content active={activeIndex === 1}>
                            <Form>
                                <Form.Group grouped>
                                    <Checkbox label='Expired Jobs'
                                        name="showExpired" onChange={this.handleFilter} checked={this.state.filter.showExpired} />
                                    <Checkbox label='Unexpired Jobs'
                                        name="showUnexpired" onChange={this.handleFilter} checked={this.state.filter.showUnexpired} />
                                </Form.Group>
                            </Form>
                        </Accordion.Content>
                        </Menu.Item>
                     </Accordion> 
                     
                     <Accordion as={Menu} vertical>  
                        <Menu.Item>
                            <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
                                <Icon name='dropdown' />
                                    Order By Date
                            </Accordion.Title>
                        <Accordion.Content active={activeIndex === 2}>
                        <Form>
                        <Form.Field>
          
                        <Checkbox  radio 
                        label='Newest First' 
                        name='date'
                        value='desc'
                        checked={this.state.sortBy.date === 'desc'}
                        onChange={this.handleSort} />
                        </Form.Field>
                        
                        <Form.Field>
                        <Checkbox  radio 
                        label='Oldest First' 
                        name='date' 
                        value='asc'
                        checked={this.state.sortBy.date === 'asc'}
                        onChange={this.handleSort} />
                        </Form.Field>
                        
                        </Form>
                        </Accordion.Content>
                        </Menu.Item>
                     </Accordion>

                    </Accordion.Content> 
                </Menu.Item>
                </Accordion>


               <Card.Group key={jblist.toString()}>
               {this.state.loadJobs.map((j,index) => {
                //    debugger;
                if((index >= ((this.state.currentPage*2)-2)) && (index < (this.state.currentPage*2))){
                    console.log("inside if index: "+index)
                    console.log("inside ifCurrentPage: "+this.state.currentPage)
            return (
                
            <Card>
            <Card.Content>
          <Card.Header>{j.title}</Card.Header>
          <Card.Meta>{j.location.city + " , "+j.location.country}</Card.Meta>
        <Card.Description>
         {j.summary}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
      <Button.Group widths='3'>
          <Button  basic color='blue' >
            Update
          </Button>
          <Button basic color='blue'>
            Close
          </Button>
          </Button.Group>
      </Card.Content>
    </Card>
     )}
    })}
  </Card.Group>
  <Pagination
             ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
            firstItem={{ content: <Icon name='angle double left' />, icon: true }}
            lastItem={{ content: <Icon name='angle double right' />, icon: true }}
            prevItem={{ content: <Icon name='angle left' />, icon: true }}
            nextItem={{ content: <Icon name='angle right' />, icon: true }}
            totalPages={this.state.totalPages}
            activePage={this.state.currentPage}
            onPageChange={(e,pagData) => this.pageChange(e,pagData)}
 />
               </div>
            </BodyWrapper>
        )
        }
        else {
            return (
                <div>
                    <h1> List of Jobs</h1>
                    <h3>No Jobs Found</h3>
                </div>);

        }

    }else {
            return (
                <div>
                    <h2> L O A D I N G .....</h2>
                    <Button primary onClick={() => this.loadData()}>getEmployerJobs</Button>
                </div>);
        }
        
    }
}