from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///visitors.db'
db = SQLAlchemy(app)

class Visitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    count = db.Column(db.Integer, default=0)

with app.app_context():
    db.create_all()
    if not Visitor.query.first():
        initial_visitor = Visitor(count=0)
        db.session.add(initial_visitor)
        db.session.commit()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/update_visitor_count', methods=['POST'])
def update_visitor_count():
    visitor = Visitor.query.first()
    visitor.count += 1
    db.session.commit()
    return jsonify({'count': visitor.count})

@app.route('/get_visitor_count')
def get_visitor_count():
    visitor = Visitor.query.first()
    return jsonify({'count': visitor.count})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port,debug=False)