create database hacktrix;
use hacktrix;
create table loggeduser(
id varchar(100) primary key not null,
username varchar(255) not null,
password varchar(255) not null,
backup_email varchar(255) not null,
account_email varchar(255) not null
);

create table tokens(
token_id varchar(100) primary key not null,
token varchar(255) not null
);
