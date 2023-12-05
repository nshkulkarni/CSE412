# CSE412

NOTE: csv files Artist, Song, and WrittenBy are available in the repository to download and import into the corresponding tables to populate the database.

PostgreSQL queries in order to create tables: 
-- Create the Song table
CREATE TABLE Song (
    S_Title VARCHAR(500),
    S_ID VARCHAR PRIMARY KEY,
    S_Genre VARCHAR(2000),
    S_Year_Released INT,
    S_Cover_Image BYTEA, -- Store images as binary data
    S_Language VARCHAR(2000),
    S_Album VARCHAR(2000),
	A_SERIAL INT, -- Foreign key reference to A_SERIAL in the Artist table
    FOREIGN KEY (A_SERIAL) REFERENCES Artist(A_SERIAL)
);

-- Create the Playlist table
CREATE TABLE Playlist (
    P_ID SERIAL PRIMARY KEY,
    P_Title VARCHAR(1000)
);

-- Create the Artist table
CREATE TABLE Artist (
	A_SERIAL INT PRIMARY KEY,
    A_ID VARCHAR,
    A_Name VARCHAR(1000),
    A_Country VARCHAR(1000)
);

-- Create the Users table
CREATE TABLE Users (
    U_UID SERIAL PRIMARY KEY,
	U_Username VARCHAR(100) UNIQUE,
    U_Password VARCHAR(100)
);

-- Create the Playlist_Songs table (relational table between Song and Playlist)
CREATE TABLE Playlist_Songs (
    S_ID VARCHAR,
    P_ID INT,
    PRIMARY KEY (S_ID, P_ID),
    FOREIGN KEY (S_ID) REFERENCES Song(S_ID),
    FOREIGN KEY (P_ID) REFERENCES Playlist(P_ID)
);

-- Create the WrittenBy table (relational table between Song and Artist)
CREATE TABLE WrittenBy (
    S_ID VARCHAR,
    A_SERIAL INT,
    PRIMARY KEY (S_ID, A_SERIAL),
    FOREIGN KEY (S_ID) REFERENCES Song(S_ID),
    FOREIGN KEY (A_SERIAL) REFERENCES Artist(A_SERIAL)
);

-- Create the Creates table (relational table between Playlist and Users)
CREATE TABLE Creates (
    P_ID INT,
    U_UID INT,
    PRIMARY KEY (P_ID, U_UID),
    FOREIGN KEY (P_ID) REFERENCES Playlist(P_ID),
    FOREIGN KEY (U_UID) REFERENCES Users(U_UID)
);

-- Create the SearchesFor table (relational table between Song, Artist, and Users)
CREATE TABLE SearchesFor (
    S_ID VARCHAR,
    A_SERIAL INT,
    U_UID INT,
    PRIMARY KEY (S_ID, A_SERIAL, U_UID),
    FOREIGN KEY (S_ID) REFERENCES Song(S_ID),
    FOREIGN KEY (A_SERIAL) REFERENCES Artist(A_SERIAL),
    FOREIGN KEY (U_UID) REFERENCES Users(U_UID)
);
