from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def residentialproject():
    return render_template('residentialproject.html')

@app.route('/mortgage')
def mortgage():
    return render_template('mortgage.html')

@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

@app.route('/floorplan')
def floorplan():
    return render_template('floorplan.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/concept')
def concept():
    return render_template('concept.html')

if __name__ == '__main__':
    app.run(debug=True)
