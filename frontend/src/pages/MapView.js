import React from 'react';
import DoctorMapSearch from '../components/DoctorMapSearch';
import { motion } from 'framer-motion';

function MapView() {
    return (
        <div className="container-responsive" style={{ paddingTop: 24, paddingBottom: 24 }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 24 }}
            >
                <h1 className="page-title">Find Nearby Doctors</h1>
                <p className="page-subtitle">
                    Search for doctors, clinics, and healthcare facilities near your location. 
                    Get directions, ratings, and contact information.
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <DoctorMapSearch />
            </motion.div>

            {/* Additional Information */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
                style={{ marginTop: 24 }}
            >
                <h2 className="card-title">How to Use</h2>
                <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%', 
                            background: '#0f766e', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            flexShrink: 0
                        }}>
                            1
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Allow Location Access</h4>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                                Enable location services to find doctors closest to you
                            </p>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%', 
                            background: '#0f766e', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            flexShrink: 0
                        }}>
                            2
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Search for Specialties</h4>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                                Enter doctor names, specialties, or clinic types
                            </p>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ 
                            width: 32, 
                            height: 32, 
                            borderRadius: '50%', 
                            background: '#0f766e', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            flexShrink: 0
                        }}>
                            3
                        </div>
                        <div>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>Get Directions & Contact</h4>
                            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                                View ratings, get directions, or call directly
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default MapView;






