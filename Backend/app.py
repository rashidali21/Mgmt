from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin 
from models import db, User
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors
from sklearn.metrics.pairwise import cosine_similarity
from fuzzywuzzy import fuzz
from sklearn.preprocessing import StandardScaler

df = pd.read_csv('processed_df.csv')

df.dropna(inplace=True)

scaler = StandardScaler()
scaled_data = scaler.fit_transform(df[['danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']])

knn = NearestNeighbors(n_neighbors=5, metric='cosine')
knn.fit(scaled_data)

app = Flask(__name__)
 
app.config['SECRET_KEY'] = 'cairocoders-ednalan'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flaskdb.db'
 
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = True
  
bcrypt = Bcrypt(app) 
CORS(app, supports_credentials=True)
db.init_app(app)
  
with app.app_context():
    db.create_all()
 
@app.route("/")
def hello_world():
    return "Hello, World!"
 
@app.route("/signup", methods=["POST"])
def signup():
    email = request.json["email"]
    password = request.json["password"]
 
    user_exists = User.query.filter_by(email=email).first() is not None
 
    if user_exists:
        return jsonify({"error": "Email already exists"}), 409
     
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
 
    session["user_id"] = new_user.id
 
    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })
 
@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
  
    user = User.query.filter_by(email=email).first()
  
    if user is None:
        return jsonify({"error": "Unauthorized Access"}), 401
  
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
      
    session["user_id"] = user.id
  
    return jsonify({
        "id": user.id,
        "email": user.email
    })

@app.route('/top_artist', methods=['GET'])
def get_top_artist():
    top_artist = df['artists'].value_counts().head(4).index.tolist()
    return jsonify({"top_artist": top_artist})

@app.route('/top_track', methods=['GET'])
def get_top_track():
    top_tracks = df.groupby('track_name').agg({'popularity': 'sum', 'artists': 'first'}).sort_values(by='popularity', ascending=False).head(5)
    top_tracks_data = [{"track_name": track, "artists": artists} for track, artists in zip(top_tracks.index, top_tracks['artists'])]
    return jsonify({"top_tracks": top_tracks_data})
 
@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    text = data['text'].lower()
    results = []

    for index, row in df.iterrows():
        track_name_similarity = fuzz.partial_ratio(text, row['track_name'].lower())
        artist_similarity = fuzz.partial_ratio(text, row['artists'].lower())

        if track_name_similarity >= 70 or artist_similarity >= 70:
            results.append((row['track_name'], row['artists'], track_name_similarity, artist_similarity))

    track_name_results = sorted(results, key=lambda x: x[2], reverse=True)[:100]
    artist_results = sorted(results, key=lambda x: x[3], reverse=True)[:20]

    unique_song_names = list(set([result[0] for result in track_name_results]))
    unique_artist_names = list(set([artist.strip() for result in artist_results for artist in result[1].replace(';', ',').split(',') if fuzz.partial_ratio(text, artist.strip().lower()) >= 80]))

    search_data = df[(df['track_name'].isin(unique_song_names)) | (df['artists'].isin(unique_artist_names))][['track_id', 'track_name', 'artists', 'popularity', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']]
    search_data = search_data.sort_values(by='popularity', ascending=False)

    search_data = search_data.drop_duplicates(subset=['track_id', 'track_name', 'artists'])[['track_id', 'track_name', 'artists']]
    search_data['track_artist'] = search_data['track_name'] + ' - ' + search_data['artists']

    return jsonify(list(search_data[['track_id', 'track_name', 'artists']].to_dict(orient='records'))[:12])

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    song_name = data['song_name']
    artist_name = data['artist_name']

    search_data = df[(df['track_name'] == song_name) | (df['artists'] == artist_name)][['track_name', 'artists', 'track_id', 'popularity', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']]
    search_data = search_data.sort_values(by='popularity', ascending=False)

    scaled_search_data = scaler.transform(search_data[['danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo']])

    _, indices = knn.kneighbors(scaled_search_data)

    recommended_tracks = df.iloc[indices.flatten()][['track_name', 'artists', 'track_id']].drop_duplicates()['track_name'].unique()
    recommended_tracks = recommended_tracks[:15]

    recommended_track_artist = []
    for track_name in recommended_tracks:
        if track_name == song_name:  
            continue
        artist_name = df[df['track_name'] == track_name]['artists'].iloc[0]
        track_id = df[df['track_name'] == track_name]['track_id'].iloc[0]
        track_artist = {"track_name": track_name, "artists": artist_name, "track_id": track_id}
        recommended_track_artist.append(track_artist)

    return jsonify(recommended_track_artist)


if __name__ == "__main__":
    app.run(debug=True)